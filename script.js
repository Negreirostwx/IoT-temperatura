console.log("script.js carregado!");


// BROKER MQTT

const broker =
    "wss://test.mosquitto.org:8081";


// TÓPICOS MQTT

const topicoTemperatura =
    "senai/aula01/esp32/temperatura/Silva";

const topicoUmidade =
    "senai/aula01/esp32/umidade/Silva";

const topicoLed =
    "senai/aula01/esp32/led/Silva";


// CONEXÃO MQTT

const client = mqtt.connect(broker);


// ELEMENTOS DO STATUS

const statusBroker =
    document.getElementById("statusBroker");

const textoStatus =
    document.getElementById("textoStatus");


// ESTADO DOS LEDS

let led1Ligado = false;
let led2Ligado = false;


// COMEÇA MOSTRANDO CONECTANDO

textoStatus.innerText =
    "Conectando ao broker...";

statusBroker.classList.add("conectando");


// QUANDO CONECTAR

client.on("connect", function () {

    console.log("Conectado ao Broker MQTT!");

    textoStatus.innerText =
        "Conectado ao broker";

    statusBroker.classList.remove(
        "conectando",
        "desconectado"
    );

    statusBroker.classList.add(
        "conectado"
    );


    // TEMPERATURA

    client.subscribe(
        topicoTemperatura,
        function (erro) {

            if (!erro) {

                console.log(
                    "Inscrito no tópico de temperatura!"
                );

            }

        }
    );


    // UMIDADE

    client.subscribe(
        topicoUmidade,
        function (erro) {

            if (!erro) {

                console.log(
                    "Inscrito no tópico de umidade!"
                );

            }

        }
    );

});


// RECEBER TEMPERATURA E UMIDADE

client.on("message", function (topic, message) {

    const valor =
        message.toString();

    console.log("Tópico:", topic);
    console.log("Mensagem:", valor);


    if (topic === topicoTemperatura) {

        document
            .getElementById("temperatura")
            .innerText = valor;

    }


    if (topic === topicoUmidade) {

        document
            .getElementById("umidade")
            .innerText = valor;

    }

});


// CONTROLE DO LED 1

function controlarLed1() {

    const botao =
        document.getElementById("botaoLed1");


    if (led1Ligado === false) {

        client.publish(
            topicoLed,
            "LED1_ON"
        );

        led1Ligado = true;

        botao.innerText =
            "Desligar LED 1";

        console.log("LED1_ON enviado");

    }

    else {

        client.publish(
            topicoLed,
            "LED1_OFF"
        );

        led1Ligado = false;

        botao.innerText =
            "Ligar LED 1";

        console.log("LED1_OFF enviado");

    }

}


// CONTROLE DO LED 2

function controlarLed2() {

    const botao =
        document.getElementById("botaoLed2");


    if (led2Ligado === false) {

        client.publish(
            topicoLed,
            "LED2_ON"
        );

        led2Ligado = true;

        botao.innerText =
            "Desligar LED 2";

        console.log("LED2_ON enviado");

    }

    else {

        client.publish(
            topicoLed,
            "LED2_OFF"
        );

        led2Ligado = false;

        botao.innerText =
            "Ligar LED 2";

        console.log("LED2_OFF enviado");

    }

}


// SE PERDER A CONEXÃO

client.on("offline", function () {

    console.log("Broker desconectado");

    textoStatus.innerText =
        "Desconectado do broker";

    statusBroker.classList.remove(
        "conectado",
        "conectando"
    );

    statusBroker.classList.add(
        "desconectado"
    );

});


// QUANDO TENTAR RECONECTAR

client.on("reconnect", function () {

    console.log("Tentando reconectar...");

    textoStatus.innerText =
        "Conectando ao broker...";

    statusBroker.classList.remove(
        "conectado",
        "desconectado"
    );

    statusBroker.classList.add(
        "conectando"
    );

});


// ERRO MQTT

client.on("error", function (erro) {

    console.log(
        "Erro MQTT:",
        erro
    );

});