const cacheName = 'password-manager-cache-v2';

// Only cache local files
const filesToCache = [
    '/',
    'index.html',
    'Home.css',
    'home.js',
    'manifest.json',
    'client-export.js',
    'decrypt.js',
    'images/add.png',
    'images/background.jpg',
    'images/export.png',
    'images/facebook.png',
    'images/favicon.png',
    'images/github.png',
    'images/gmail.png',
    'images/instagram.png',
    'images/linkedin.png',
    'images/lockicon.png',
    'images/pinterest.png',
    'images/reddit.png',
    'images/snapchat.png',
    'images/tiktok.png',
    'images/twitter.png',
    'images/decrypt.png' // Add the decrypt icon
];

// Function to check if URL is local
function isLocalUrl(url) {
    try {
        const parsedUrl = new URL(url);
        // Check if URL is relative or has our domain
        return !parsedUrl.protocol.startsWith('http') || 
               parsedUrl.hostname === location.hostname;
    } catch (e) {
        // If URL parsing fails, it's probably a relative path
        return true;
    }
}

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            return Promise.all(
                filesToCache.map(file => {
                    // Only cache local files
                    if (!isLocalUrl(file)) {
                        console.log(`Skipping non-local file: ${file}`);
                        return Promise.resolve();
                    }
                    
                    return fetch(file)
                        .then(response => {
                            if (!response.ok) {
                                console.error(`Failed to fetch ${file}`);
                                return Promise.resolve(); // Continue with others
                            }
                            return cache.put(file, response.clone());
                        })
                        .catch(error => {
                            console.error(`Error caching ${file}:`, error);
                            return Promise.resolve(); // Continue with others
                        });
                })
            );
        })
        .catch(error => {
            console.error('Error during cache installation:', error);
            return Promise.resolve(); // Don't fail the installation
        })
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== 'password-manager-cache-v1') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    const requestUrl = new URL(e.request.url);
    
    // Skip external resources
    if (!isLocalUrl(e.request.url)) {
        return fetch(e.request);
    }

    e.respondWith(
        caches.match(e.request)
        .then(response => {
            if (response) return response;
            
            // Clone request to avoid read-only issues
            const fetchRequest = e.request.clone();
            
            return fetch(fetchRequest)
                .then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone response to cache it
                    const responseToCache = response.clone();
                    
                    caches.open(cacheName)
                        .then(cache => {
                            cache.put(e.request, responseToCache);
                        });
                    
                    return response;
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                    return response;
                });
        })
    );
});
