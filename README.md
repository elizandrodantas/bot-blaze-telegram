<div id="topo"></div>

<div align="center">
    <a style="text-decoration: none" href="https://blaze.com/r/dZONo">
        <img src="https://blaze.com/images/logo-icon.png" alt="..." width="auto" height="95"/>
    </a>
</div>

<h2 align="center"> Bot Blaze Double </h2>

A [blaze.com](https://blaze.com/r/dZONo), site de aposta online, operada pela empresa **Prolific Trade N.V.** e bastante popular nas mídias sociais. Em um de seus jogos, o jogador aposta entre 3 cores (vermelho 🔴, preto ⚫️ e branco ⚪️) e o valor apostado pode multiplicar até 14x.

O objetivo deste bot é enviar, após uma [analise](#analise), sinais do resultado da proxima rodada para grupos/canais/chat do telegram.

**❤️ Donation ❤️:** `ce71c8ba-4c42-4a72-85b4-64fbe3ace08e` _chave aleatoria_ **NuBank 💜**

## Analise 
- _as entradas são feitas por condições definidas na analise;_
- _essa analise não é 100% eficaz, desenvolva sua própria análise caso queira melhores resultados;_
- alterações de analise podem ser feitas no arquivo [`analise.mjs`](https://github.com/elizandrodantas/bot-blaze-telegram/blob/main/src/core/analise.mjs).

<p align="right"><a href="#topo">topo</a></p>

## Novidades (v0.1.2)

1. Adicionado a funcionalidade de resumo das jogadas diarias:
    - envio de mensagem personalizada;
    - _essa funcionalidade foi uma sugestão de um usuário_
    - <img src="./assets/15-09-2022.png" alt="screenshot">
2. Opção de não entrar no gale

<p align="right"><a href="#topo">topo</a></p>

## Visualizar

<img src="./assets/20220827_221141.gif" alt="..." />

<p align="right"><a href="#topo">topo</a></p>

## Requisitos

* [NodeJs](https://nodejs.org/en/download/)
* [Git](https://git-scm.com/downloads)

<p align="right"><a href="#topo">topo</a></p>

## Instalação

1. **Clone o repositório**
```sh
git clone https://github.com/elizandrodantas/bot-blaze-telegram
```

2. **Instalar as dependencias**
- npm
```sh
npm install
```
- yarn
```sh
yarn
```

3. **Variáveis de ambiente `(.env)`**
_dentro do repositorio existe um arquivo de exemplo `(.env.example)`_

```js
URL_BLAZE="" // url WS da blaze
BASE_URL="" // base url do site da blaze
BOT_TOKEN="" // token do bot telegram
ID_GROUP_MESSAGE="" // id do grupo/canal/chat do telegram que ira receber os sinais (string)
```

_caso as variaveis não forem encontradas dentro do processo, serão setados em forma de input no console_ **(>= v0.1.1\*)**

<p align="right"><a href="#topo">topo</a></p>

## Uso

```javascript
import { BotBlazeWithTelegram } from './src/index.mjs';

new BotBlazeWithTelegram(options).run();
```

_as opções estão detalhadas em [opções](#opções)_

<p align="right"><a href="#topo">topo</a></p>

## Opções

#### Interface
```ts
interface IConstructorClassDad {
    timeAfterWin?: boolean | IOptionsTimePaused;
    timeAfterLoss?: boolean | IOptionsTimePaused;
    refBlaze?s: string;
    sticker: ISticker;
    enterProtection?: boolean;
    summaryOfResult?: boolean | IOptionsSummaryOfResult;
    noGale?: boolean;
}

interface IOptionsTimePaused {
    time: number;
    message: string;
}

interface ISticker {
    winNotGale: string;
    winGaleOne: string;
    winGaleTwo: string;
    loss: string;
    winWhite: string;
}

interface IOptionsSummaryOfResult {
    interval: number;
    message: (number: INumberSummary, info: IInfoSummary, cb?: (message: string) => void); 
}

interface INumberSummary {
    win: number;
    loss: number;
    gale: number;
    gale1: number;
    gale2: number;
    white: number;
    consecutive: number;
    total: number;
}

interface IInfoSummary {
    date: string;
    lastUpdate: number;
    day: number;
}
```

#### Detalhes
* **IConstructorClassDad.timeAfterWin** _pausa as entradas do bot apos um **WIN**_
    - `IConstructorClassDad.timeAfterWin.message` - mensagem apresentada quando pausa ativa (padrão: sem mensagem)
    - `IConstructorClassDad.timeAfterWin.time` - tempo que ficara em pausa _em minutos_ (padrão: 3)
* **IConstructorClassDad.timeAfterLoss** _pausa as entradas do bot apos um **LOSS**_
    - `IConstructorClassDad.timeAfterLoss.message` - mensagem apresentada quando pausa ativa (padrão: sem mensagem)
    - `IConstructorClassDad.timeAfterLoss.time` - tempo que ficara em pausa _em minutos_ (padrão: 3)
* **IConstructorClassDad.refBlaze** _codigo de referencia blaze_
* **IConstructorClassDad.sticker** _os arquivos devem ficar na pasta **sticker** na raiz_
    - `IConstructorClassDad.sticker.winNotGale` - nome da figura quando resultado: WIN sem GALE
    - `IConstructorClassDad.sticker.winGaleOne` - nome da figura quando resultado: WIN no GALE 1
    - `IConstructorClassDad.sticker.winGaleTwo` - nome da figura quando resultado: WIN no GALE 2
    - `IConstructorClassDad.sticker.loss` - nome da figura quando resultado: LOSS
    - `IConstructorClassDad.sticker.winWhite` - nome da figura quando resultado: WHITE
* **IConstructorClassDad.enterProtection** _enviar entrada de proteção no BRANCO nas mensagens de entrada_
* **IConstructorClassDad.summaryOfResult** _opções de resumo_
    - `IConstructorClassDad.summaryOfResult.interval` - intervalo para envio de mensagem. obs.: caso valor `1`, a cada 1 jogada ele enviara o resumo
    - `IConstructorClassDad.summaryOfResult.message` - mensagem personalizada
* **IConstructorClassDad.noGale** _caso verdadeiro, não fara entrada nas jogadas gale_

### Todas opões com forma de uso:
```js
{
    //tempo após win
    timeAfterWin: true,
    // or
    timeAfterWin: {
        message: "mensagem",
        time: 3
    },

    // tempo após loss
    timeAfterLoss: true,
    // or
    timeAfterLoss: {
        message: "mensagem",
        time: 3
    },
    
    // sticker/figura
    // nessa opção podem ser usado imagens que estão dentro da pasta STICKER
    sticker: {
        winNotGale: "win.jpg",
        winGaleOne: "win-in-gale.jpg",
        winGaleTwo: "win-in-gale.jpg",
        winWhite: "win-white.jpg",
        loss: "loss.jpg",
    },

    // entrar em proteção (branco)
    enterProtection: true //sim
    enterProtection: false //não

    //envio de mensagens com resumo do dia
    summaryOfResult: {
        interval: 2 // a cada 2 jogadas, ele enviara mensagem personalizada abaixo
        message: function(number, info, cb){
            // number - numeros do resumo (todos possiveis estão em interface "INumberSummary")
            // info - informações do resumo (todos possiveis estão em interface "IInfoSummary")
            // cb - esse callback é uma ou mais mensagens que podem ser enviados alem do retorno desta, o valor request apenas uma string ( ex: cb('mensagem sobressalente') )


            // opção de outras mensagens (não obrigatorio)
            cb("mensagem sobressalente");

            return "Total de jogadas: ${number.total}" +
            "\nWins seguidos: ${number.consecutive} ✅" +
            "\nTotal de win: ${number.win} ✅" +
            "\nTotal de loss: ${number.loss} ❌" +
            "\nTaxa de acertividade: ${(number.win / number.total * 100).toFixed(1)}%";
        }
    }

    // Opção de entrada nas jogadas gale 1 e 2
    noGale: true // não entra
}
```

<p align="right"><a href="#topo">topo</a></p>

## Exemplos

1. No _exemplo1_ [`example/example-with-dotenv.mjs`] usando a ferramenta [Dotenv](https://github.com/motdotla/dotenv)
2. No _exemplo2_ [`example/example-without-dotenv.mjs`] as variáveis ambiente deveram ser setadas direto no sistema ou preenchendo o formulário que será exibido no console

<p align="right"><a href="#topo">topo</a></p>

## Contato

Instagram: <a href="https://www.instagram.com/elizandrodantas/" target="_blank">Elizandro Dantas</a>

<p align="right"><a href="#topo">topo</a></p>