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

const ARQUIVOS = [

    "./",

    "./index.html",

    "./css/style.css",

    "./js/app.js",

    "./manifest.json"

];


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

self.addEventListener(

    "fetch",

    event => {

        event.respondWith(

            caches.match(

                event.request

            )

            .then(resposta => {

                if (resposta) {

                    return resposta;

                }

                return fetch(

                    event.request

                )

                .then(networkResponse => {

                    if (

                        event.request.method === "GET"

                    ) {

                        const copia = networkResponse.clone();

                        caches.open(

                            CACHE_NAME

                        )

                        .then(cache => {

                            cache.put(

                                event.request,

                                copia

                            );

                        });

                    }

                    return networkResponse;

                })

                .catch(() => {

                    if (

                        event.request.destination === "document"

                    ) {

                        return caches.match(

                            "./index.html"

                        );

                    }

                });

            })

        );

    }

);


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