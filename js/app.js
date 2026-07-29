/*==========================================================
    DISCIPULADO CRISTÃO
    app.js
    Parte 1
==========================================================*/


"use strict";




/*==========================================================
    ELEMENTOS
==========================================================*/

const audios = document.querySelectorAll("audio");

const linksPdf = document.querySelectorAll(".subtopico a");

const licoes = document.querySelectorAll(".licao");

const body = document.body;


/*==========================================================
    VARIÁVEIS
==========================================================*/

let indiceAtual = 0;

let audioAtual = null;


/*==========================================================
    CARREGA PROGRESSO
==========================================================*/

window.addEventListener("load", () => {

    const salvo = localStorage.getItem("discipulado-audio");

    if (salvo !== null) {

        indiceAtual = Number(salvo);

    }

});


/*==========================================================
    SALVA PROGRESSO
==========================================================*/

function salvarIndice() {

    localStorage.setItem(

        "discipulado-audio",

        indiceAtual

    );

}


/*==========================================================
    PARAR TODOS
==========================================================*/

function pararTodosAudios() {

    audios.forEach(audio => {

        audio.pause();

        audio.currentTime = 0;

    });

}


/*==========================================================
    TOCAR ÁUDIO
==========================================================*/

function tocarAudio(indice) {

    if (indice < 0) {

        return;

    }

    if (indice >= audios.length) {

        return;

    }

    pararTodosAudios();

    audioAtual = audios[indice];

    indiceAtual = indice;

    salvarIndice();

    audioAtual.play();

}


/*==========================================================
    ÁUDIO SEGUINTE
==========================================================*/

function proximoAudio() {

    indiceAtual++;

    if (indiceAtual >= audios.length) {

        indiceAtual = 0;

    }

    tocarAudio(indiceAtual);

}


/*==========================================================
    ÁUDIO ANTERIOR
==========================================================*/

function audioAnterior() {

    indiceAtual--;

    if (indiceAtual < 0) {

        indiceAtual = audios.length - 1;

    }

    tocarAudio(indiceAtual);

}


/*==========================================================
    EVENTOS DOS ÁUDIOS
==========================================================*/

audios.forEach((audio, indice) => {

    audio.dataset.index = indice;

});


/*==========================================================
    PLAY
==========================================================*/

audios.forEach(audio => {

    audio.addEventListener("play", function () {

        audios.forEach(outro => {

            if (outro !== this) {

                outro.pause();

            }

        });

        indiceAtual = Number(this.dataset.index);

        salvarIndice();

    });

});


/*==========================================================
    FINAL DO ÁUDIO
==========================================================*/

audios.forEach(audio => {

    audio.addEventListener("ended", () => {

        proximoAudio();

    });

});


/*==========================================================
    DUPLO CLIQUE NA IMAGEM
==========================================================*/

const imagens = document.querySelectorAll(".subtopico img");

imagens.forEach(imagem => {

    imagem.addEventListener("dblclick", () => {

        imagem.requestFullscreen();

    });

});


/*==========================================================
    ABRIR PDF
==========================================================*/

linksPdf.forEach(link => {

    link.addEventListener("click", () => {

        console.log(

            "PDF aberto."

        );

    });

});


/*==========================================================
    ROLAGEM SUAVE
==========================================================*/

document.querySelectorAll("a").forEach(link => {

    const href = link.getAttribute("href");

    if (

        href &&

        href.startsWith("#")

    ) {

        link.addEventListener(

            "click",

            function (e) {

                e.preventDefault();

                document.querySelector(href).scrollIntoView({

                    behavior: "smooth"

                });

            }

        );

    }

});


/*==========================================================
    TECLAS
==========================================================*/

document.addEventListener(

    "keydown",

    event => {

        switch (event.key) {

            case "ArrowRight":

                proximoAudio();

                break;

            case "ArrowLeft":

                audioAnterior();

                break;

        }

    }

);


/*==========================================================
    PARTE 2
==========================================================*/

/*==========================================================
    DISCIPULADO CRISTÃO
    app.js
    Parte 2
==========================================================*/


"use strict";


/*==========================================================
    PROGRESSO DAS LIÇÕES
==========================================================*/

const chaveProgresso = "discipulado-progresso";

let progresso = {};


const progressoSalvo = localStorage.getItem(

    chaveProgresso

);


if (progressoSalvo) {

    progresso = JSON.parse(

        progressoSalvo

    );

}


/*==========================================================
    SALVAR PROGRESSO
==========================================================*/

function salvarProgresso() {

    localStorage.setItem(

        chaveProgresso,

        JSON.stringify(

            progresso

        )

    );

}


/*==========================================================
    MARCAR SUBTÓPICO CONCLUÍDO
==========================================================*/

function concluirSubtopico(indice) {

    progresso[indice] = true;

    salvarProgresso();

    atualizarVisual();

}


/*==========================================================
    VERIFICAR CONCLUSÃO
==========================================================*/

function concluido(indice) {

    return progresso[indice] === true;

}


/*==========================================================
    ATUALIZA VISUAL
==========================================================*/

function atualizarVisual() {

    audios.forEach((audio, indice) => {

        const card = audio.closest(

            ".subtopico"

        );

        if (!card) {

            return;

        }

        if (concluido(indice)) {

            card.classList.add(

                "concluido"

            );

        } else {

            card.classList.remove(

                "concluido"

            );

        }

    });

}


/*==========================================================
    QUANDO TERMINA O ÁUDIO
==========================================================*/

audios.forEach((audio, indice) => {

    audio.addEventListener(

        "ended",

        () => {

            concluirSubtopico(

                indice

            );

        }

    );

});


/*==========================================================
    BARRA DE PROGRESSO
==========================================================*/

function porcentagemCurso() {

    const total = audios.length;

    const feitos = Object.keys(

        progresso

    ).length;

    if (total === 0) {

        return 0;

    }

    return Math.round(

        (feitos / total) * 100

    );

}


/*==========================================================
    MOSTRAR PROGRESSO
==========================================================*/

function mostrarProgresso() {

    console.log(

        "Curso:",

        porcentagemCurso() + "%"

    );

}


/*==========================================================
    RESTAURAR ÁUDIO
==========================================================*/

window.addEventListener(

    "load",

    () => {

        atualizarVisual();

        mostrarProgresso();

    }

);


/*==========================================================
    BOTÃO CONTINUAR
==========================================================*/

const botaoContinuar = document.getElementById(

    "continuar"

);


if (botaoContinuar) {

    botaoContinuar.addEventListener(

        "click",

        () => {

            tocarAudio(

                indiceAtual

            );

        }

    );

}


/*==========================================================
    BOTÃO REINICIAR
==========================================================*/

const botaoReiniciar = document.getElementById(

    "reiniciar"

);


if (botaoReiniciar) {

    botaoReiniciar.addEventListener(

        "click",

        () => {

            if (

                confirm(

                    "Deseja apagar todo o progresso?"

                )

            ) {

                localStorage.clear();

                location.reload();

            }

        }

    );

}


/*==========================================================
    ROLAR PARA O ÁUDIO ATUAL
==========================================================*/

function rolarAtual() {

    if (

        !audios[indiceAtual]

    ) {

        return;

    }

    audios[indiceAtual].scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


/*==========================================================
    AO INICIAR PLAY
==========================================================*/

audios.forEach((audio) => {

    audio.addEventListener(

        "play",

        () => {

            rolarAtual();

        }

    );

});


/*==========================================================
    PARTE 3
==========================================================*/


"use strict";


/*==========================================================
    INSTALAÇÃO DO PWA
==========================================================*/

let eventoInstalacao = null;

const botaoInstalar = document.getElementById(

    "instalarApp"

);


window.addEventListener(

    "beforeinstallprompt",

    (event) => {

        event.preventDefault();

        eventoInstalacao = event;

        if (botaoInstalar) {

            botaoInstalar.style.display = "inline-block";

        }

    }

);


if (botaoInstalar) {

    botaoInstalar.addEventListener(

        "click",

        async () => {

            if (!eventoInstalacao) {

                return;

            }

            eventoInstalacao.prompt();

            await eventoInstalacao.userChoice;

            eventoInstalacao = null;

            botaoInstalar.style.display = "none";

        }

    );

}


/*==========================================================
    APP INSTALADO
==========================================================*/

window.addEventListener(

    "appinstalled",

    () => {

        console.log(

            "Aplicativo instalado."

        );

    }

);


/*==========================================================
    STATUS DA INTERNET
==========================================================*/

window.addEventListener(

    "online",

    () => {

        console.log(

            "Conectado."

        );

    }

);


window.addEventListener(

    "offline",

    () => {

        console.log(

            "Modo Offline."

        );

    }

);


/*==========================================================
    VELOCIDADE DOS ÁUDIOS
==========================================================*/

let velocidade = 1;


function alterarVelocidade(valor) {

    velocidade = valor;

    audios.forEach(audio => {

        audio.playbackRate = velocidade;

    });

}


/*==========================================================
    TECLAS DE VELOCIDADE
==========================================================*/

document.addEventListener(

    "keydown",

    event => {

        switch (event.key) {

            case "1":

                alterarVelocidade(1);

                break;

            case "2":

                alterarVelocidade(1.25);

                break;

            case "3":

                alterarVelocidade(1.5);

                break;

            case "4":

                alterarVelocidade(2);

                break;

        }

    }

);


/*==========================================================
    SALVAR TEMPO DO ÁUDIO
==========================================================*/

audios.forEach((audio, indice) => {

    audio.addEventListener(

        "timeupdate",

        () => {

            localStorage.setItem(

                "tempo-" + indice,

                audio.currentTime

            );

        }

    );

});


/*==========================================================
    RESTAURAR TEMPO
==========================================================*/

audios.forEach((audio, indice) => {

    const tempo = localStorage.getItem(

        "tempo-" + indice

    );

    if (tempo) {

        audio.currentTime = Number(

            tempo

        );

    }

});


/*==========================================================
    MEDIA SESSION
==========================================================*/

if ("mediaSession" in navigator) {

    navigator.mediaSession.setActionHandler(

        "play",

        () => {

            tocarAudio(

                indiceAtual

            );

        }

    );



    navigator.mediaSession.setActionHandler(

        "pause",

        () => {

            audios[indiceAtual].pause();

        }

    );



    navigator.mediaSession.setActionHandler(

        "nexttrack",

        () => {

            proximoAudio();

        }

    );



    navigator.mediaSession.setActionHandler(

        "previoustrack",

        () => {

            audioAnterior();

        }

    );

}


/*==========================================================
    ROLAGEM AUTOMÁTICA
==========================================================*/

audios.forEach(audio => {

    audio.addEventListener(

        "play",

        () => {

            audio.scrollIntoView({

                behavior: "smooth",

                block: "center"

            });

        }

    );

});


/*==========================================================
    ÚLTIMO ÁUDIO
==========================================================*/

function ultimoAudio() {

    return indiceAtual === audios.length - 1;

}


/*==========================================================
    CURSO CONCLUÍDO
==========================================================*/

function cursoConcluido() {

    if (ultimoAudio()) {

        console.log(

            "Parabéns! Curso concluído."

        );

    }

}


/*==========================================================
    FINAL DO CURSO
==========================================================*/

audios.forEach(audio => {

    audio.addEventListener(

        "ended",

        () => {

            cursoConcluido();

        }

    );

});


/*==========================================================
    PRELOAD DOS ÁUDIOS
==========================================================*/

audios.forEach(audio => {

    audio.preload = "metadata";

});


/*==========================================================
    DESABILITA MENU DE CONTEXTO NAS IMAGENS
==========================================================*/

document.querySelectorAll(

    ".subtopico img"

).forEach(img => {

    img.addEventListener(

        "contextmenu",

        event => {

            event.preventDefault();

        }

    );

});


/*==========================================================
    MENSAGEM DE BOAS-VINDAS
==========================================================*/

window.addEventListener(

    "load",

    () => {

        console.log(

            "Bem-vindo ao Discipulado Cristão."

        );

    }

);


/*==========================================================
    FIM DO ARQUIVO
==========================================================*/

/*==========================================================
    ACORDEON DAS LIÇÕES
==========================================================*/

const botoes = document.querySelectorAll(".licao-btn");

/* Fechar todas */

function fecharTodos() {

    document.querySelectorAll(".licao").forEach(licao => {

        licao.querySelectorAll(".subtopico").forEach(sub => {

            sub.style.display = "none";

        });

    });

    botoes.forEach(botao => {

        botao.classList.remove("ativa");

    });

}

/* Abrir uma lição */

function abrirLicao(indice) {

    fecharTodos();

    const botao = botoes[indice];

    if (!botao) return;

    const secao = botao.closest(".licao");

    secao.querySelectorAll(".subtopico").forEach(sub => {

        sub.style.display = "block";

    });

    botao.classList.add("ativa");

}

/* Restaurar última lição */

const ultimaLicao = localStorage.getItem("licaoAberta");

if (ultimaLicao !== null) {

    abrirLicao(Number(ultimaLicao));

} else {

    abrirLicao(0);

}

/* Clique */

botoes.forEach((botao, indice) => {

    botao.addEventListener("click", () => {

        const aberta = botao.classList.contains("ativa");

        fecharTodos();

        if (!aberta) {

            abrirLicao(indice);

            localStorage.setItem(
                "licaoAberta",
                indice
            );

        } else {

            localStorage.removeItem("licaoAberta");

        }

    });

});