/*==========================================================
    DISCIPULADO CRISTÃO
    service-worker.js
==========================================================*/

"use strict";


/*==========================================================
    VERSÃO DO CACHE
==========================================================*/

const CACHE_NAME = "discipulado-cristao-v1";


/*==========================================================
    ARQUIVOS PRINCIPAIS
==========================================================*/

const ARQUIVOS = [];

/*==========================================================
    INSTALAÇÃO
==========================================================*/

self.addEventListener(

    "install",

    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)

                .then(cache => {

                    return cache.addAll(

                        ARQUIVOS

                    );

                })

        );

        self.skipWaiting();

    }

);


/*==========================================================
    ATIVAÇÃO
==========================================================*/

self.addEventListener(

    "activate",

    event => {

        event.waitUntil(

            caches.keys()

                .then(chaves => {

                    return Promise.all(

                        chaves.map(chave => {

                            if (

                                chave !== CACHE_NAME

                            ) {

                                return caches.delete(

                                    chave

                                );

                            }

                        })

                    );

                })

        );

        self.clients.claim();

    }

);


/*==========================================================
    FETCH
==========================================================*/

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    const url = new URL(event.request.url);

    // NÃO FAZER CACHE DOS ARQUIVOS PRINCIPAIS
    if (

        url.pathname.endsWith(".html") ||
        url.pathname.endsWith(".css") ||
        url.pathname.endsWith(".js") ||
        url.pathname.endsWith("manifest.json")

    ) {

        event.respondWith(

            fetch(event.request)

                .catch(() => caches.match(event.request))

        );

        return;

    }

    // CACHE PARA IMAGENS, ÁUDIOS, PDFs...

    event.respondWith(

        caches.match(event.request)

            .then(cacheResponse => {

                if (cacheResponse) {

                    return cacheResponse;

                }

                return fetch(event.request)

                    .then(networkResponse => {

                        if (networkResponse.ok) {

                            caches.open(CACHE_NAME)

                                .then(cache => {

                                    cache.put(

                                        event.request,

                                        networkResponse.clone()

                                    );

                                });

                        }

                        return networkResponse;

                    });

            })

    );

});

/*==========================================================
    MENSAGENS
==========================================================*/

self.addEventListener(

    "message",

    event => {

        if (

            event.data === "SKIP_WAITING"

        ) {

            self.skipWaiting();

        }

    }

);


/*==========================================================
    FIM
==========================================================*/