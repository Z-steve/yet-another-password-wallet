const cacheName = 'password-manager-cache-v1';

const filesToCache = [
    '/',
    '/Home.html',
    '/Home.css',
    '/home.js',
    '/manifest.json',
    '/images/add.png',
    '/images/background.jpg',
    '/images/export.png',
    '/images/facebook.png',
    '/images/favicon.png',
    '/images/github.png',
    '/images/gmail.png',
    '/images/instagram.png',
    '/images/linkedin.png',
    '/images/lockicon.png',
    '/images/pinterest.png',
    '/images/reddit.png',
    '/images/snapchat.png',
    '/images/tiktok.png',
    '/images/twitter.png',
    'client-export.js',
    'decrypt.js'
]; 

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            return Promise.all(
                filesToCache.map(file => {
                    return fetch(file)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`Failed to fetch ${file}`);
                            }
                            return cache.put(file, response);
                        })
                        .catch(error => {
                            console.error(`Error caching ${file}:`, error);
                            return Promise.resolve(); // Continue with other files
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
