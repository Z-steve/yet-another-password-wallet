const cacheName = 'password-manager-cache';

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
    '/images/twitter.png'
]; 

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll(filesToCache))
  );
});

self.addEventListener('activate', e => self.clients.claim());

self.addEventListener('fetch', e => {
    
  e.respondWith(
      caches.match(e.request)
      .then(response => response ? response : fetch(e.request))
      .catch(error => console.log(error))
  );

});
