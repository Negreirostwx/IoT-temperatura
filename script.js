
const BROKER = "wss://broker.hivemq.com:8884/mqtt";

const TOPICO_TEMPERATURA = "senai/aula01/esp32/temperatura/Silva";
const TOPICO_UMIDADE = "senai/aula01/esp32/umidade/Silva";
const TOPICO_LED = "senai/aula01/esp32/led/Silva";

// Elementos HTML
const statusBroker = document.getElementById("statusBroker");
const textoStatus = document.getElementById("textoStatus");
const temperatura = document.getElementById("temperatura");
const umidade = document.getElementById("umidade");
const botaoLed1 = document.getElementById("botaoLed1");
const botaoLed2 = document.getElementById("botaoLed2");

// Estado dos LEDs
let led1Ligado = false;
let led2Ligado = false;
let cliente = null;

// Atualiza o status na tela
function mostrarStatus(classe, mensagem) {
    statusBroker.className = "status-broker " + classe;
    textoStatus.textContent = mensagem;
}

// Verifica se a biblioteca MQTT carregou
if (typeof mqtt === "undefined") {

    mostrarStatus(
        "desconectado",
        "Erro ao carregar a biblioteca MQTT"
    );

    console.error("Biblioteca MQTT não carregada!");

} else {

    // Conecta ao broker
    cliente = mqtt.connect(BROKER, {
        clientId: "dashboard_ana_" + Math.random().toString(16).slice(2),
        reconnectPeriod: 2000,
        connectTimeout: 10000
    });

    // Conectado
    cliente.on("connect", function () {

        mostrarStatus("conectado", "Conectado ao broker");

        console.log("Conectado ao broker!");

        cliente.subscribe([
            TOPICO_TEMPERATURA,
            TOPICO_UMIDADE
        ], function (erro) {

            if (erro) {
                console.error("Erro na inscrição:", erro);
            }

        });
    });

    // Recebe dados do ESP32
    cliente.on("message", function (topico, mensagem) {

        const valor = mensagem.toString();

        if (topico === TOPICO_TEMPERATURA) {
            temperatura.textContent = valor;
        }

        if (topico === TOPICO_UMIDADE) {
            umidade.textContent = valor;
        }

    });

    // Desconectado
    cliente.on("close", function () {

        mostrarStatus(
            "desconectado",
            "Desconectado do broker"
        );

    });

    // Reconectando
    cliente.on("reconnect", function () {

        mostrarStatus(
            "conectando",
            "Reconectando ao broker..."
        );

    });

    // Erros
    cliente.on("error", function (erro) {
        console.error("Erro MQTT:", erro);
    });
}

// CONTROLE LED 1
function controlarLed1() {

    if (!cliente || !cliente.connected) {
        alert("Sem conexão com o broker MQTT.");
        return;
    }

    const comando = led1Ligado ? "LED1_OFF" : "LED1_ON";

    cliente.publish(TOPICO_LED, comando, function (erro) {

        if (erro) {
            console.error("Falha ao enviar comando:", erro);
            return;
        }

        led1Ligado = !led1Ligado;

        botaoLed1.textContent = led1Ligado
            ? "Desligar LED 1"
            : "Ligar LED 1";
    });
}

// CONTROLE LED 2
function controlarLed2() {

    if (!cliente || !cliente.connected) {
        alert("Sem conexão com o broker MQTT.");
        return;
    }

    const comando = led2Ligado ? "LED2_OFF" : "LED2_ON";

    cliente.publish(TOPICO_LED, comando, function (erro) {

        if (erro) {
            console.error("Falha ao enviar comando:", erro);
            return;
        }

        led2Ligado = !led2Ligado;

        botaoLed2.textContent = led2Ligado
            ? "Desligar LED 2"
            : "Ligar LED 2";
    });
}
