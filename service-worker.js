const CACHE_NAME = 'receitas-com-charme-v1';
// Lista de URLs para pré-cache, incluindo a página principal e dependências essenciais.
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
  'https://esm.sh/react-router-dom@^7.8.1',
  'https://esm.sh/react-dom@^19.1.1/',
  'https://esm.sh/react@^19.1.1',
  'https://esm.sh/@google/genai@^1.15.0',
  'https://esm.sh/framer-motion@^11.3.19'
];

// Evento de instalação: abre o cache e adiciona os recursos da aplicação.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Evento de ativação: limpa caches antigos para garantir que a versão mais recente seja usada.
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de fetch: intercepta todas as requisições de rede.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se o recurso estiver no cache, retorna a resposta do cache.
        if (response) {
          return response;
        }

        // Se não estiver no cache, busca na rede.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Verifica se a resposta é válida.
            if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Adiciona a resposta ao cache para uso offline futuro.
                // Não armazena em cache requisições POST ou chamadas de API dinâmicas.
                if (event.request.method === 'GET' && !event.request.url.includes('googleapis.com')) {
                    cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});
