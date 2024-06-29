const cacheName = 'task-manager-cache-v1';
const assetsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/scripts.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(assetsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-tasks') {
        event.waitUntil(syncTasks());
    }
});

async function syncTasks() {
    const tasks = JSON.parse(await localStorage.getItem('tasks')) || [];
    const now = new Date();

    tasks.forEach(task => {
        const timeToStart = new Date(task.start) - now;
        const timeToDeadline = new Date(task.deadline) - now;

        if (timeToStart > 0) {
            setTimeout(() => {
                showNotification(`Task "${task.name}" is starting now!`);
            }, timeToStart);
        }

        if (timeToDeadline > 0) {
            setTimeout(() => {
                showNotification(`Task "${task.name}" is due now!`);
            }, timeToDeadline);
        }
    });
}

function showNotification(message) {
    self.registration.showNotification('Task Manager', {
        body: message,
        icon: 'icon-192.png'
    });
}

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            return clients.openWindow('/');
        })
    );
});
