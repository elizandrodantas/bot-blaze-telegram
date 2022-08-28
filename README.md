<div id="topo"></div>

<div align="center">
    <a style="text-decoration: none" href="https://blaze.com/r/dZONo">
        <img src="https://blaze.com/images/logo-icon.png" alt="..." width="auto" height="95"/>
    </a>
</div>

<h2 align="center"> Bot Blaze Double </h2>

A [blaze.com](https://blaze.com/r/dZONo), site de aposta online, operada pela empresa **Prolific Trade N.V.** e bastante popular nas mídias sociais. Em um de seus jogos, o jogador aposta entre 3 cores (vermelho 🔴, preto ⚫️ e branco ⚪️) e o valor apostado pode multiplicar até 14x.

O objetivo deste bot é enviar, após uma [analise](#analise), sinais do resultado da proxima rodada para grupos/canais/chat do telegram.

## Analise 
_as entradas são feitas por condições definidas na analise_
* Alterações de analise podem ser feitas no arquivo [`analise.mjs`](https://github.com/elizandrodantas/bot-blaze-telegram/blob/main/src/core/analise.mjs)

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

_caso as variaveis não forem encontradas dentro do processo, serão setados em forma de input no console_ **(>v0.1.1)**

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
    timeAfterWin: boolean | IOptionsTimePaused;
    timeAfterLoss: boolean | IOptionsTimePaused;
    refBlaze: string;
    sticker: ISticker;
    enterProtection: boolean;
}

interface IOptionsTimePaused {
    timePaused: number;
    pauseMessage: string;
}

interface ISticker {
    winNotGale: string;
    winGaleOne: string;
    winGaleTwo: string;
    loss: string;
}
```

#### Detalhes
* **IConstructorClassDad.timeAfterWin** _pausa as entradas do bot apos um **WIN**_
    - `IConstructorClassDad.timeAfterWin.pauseMessage` - mensagem apresentada quando pausa ativa (padrão: sem mensagem)
    - `IConstructorClassDad.timeAfterWin.timePaused` - tempo que ficara em pausa _em minutos_ (padrão: 3)
* **IConstructorClassDad.timeAfterLoss** _pausa as entradas do bot apos um **LOSS**_
    - `IConstructorClassDad.timeAfterLoss.pauseMessage` - mensagem apresentada quando pausa ativa (padrão: sem mensagem)
    - `IConstructorClassDad.timeAfterLoss.timePaused` - tempo que ficara em pausa _em minutos_ (padrão: 3)
* **IConstructorClassDad.refBlaze** _codigo de referencia blaze_
* **IConstructorClassDad.sticker** _os arquivos devem ficar na pasta **sticker** na raiz_
    - `IConstructorClassDad.sticker.winNotGale` - nome da figura quando resultado: WIN sem GALE
    - `IConstructorClassDad.sticker.winGaleOne` - nome da figura quando resultado: WIN no GALE 1
    - `IConstructorClassDad.sticker.winGaleTwo` - nome da figura quando resultado: WIN no GALE 2
    - `IConstructorClassDad.sticker.loss` - nome da figura quando resultado: LOSS
* **IConstructorClassDad.enterProtection** _enviar entrada de proteção no BRANCO nas mensagens de entrada_

<p align="right"><a href="#topo">topo</a></p>

## Exemplos

1. No [exemplo1](https://github.com/elizandrodantas/bot-blaze-telegram/tree/main/example/example-with-dotenv.mjs) usando a ferramenta [Dotenv](https://github.com/motdotla/dotenv)
2. No [exemplo2](https://github.com/elizandrodantas/bot-blaze-telegram/tree/main/example/example-without-dotenv.mjs) as variáveis ambiente deveram ser setadas direto no sistema ou preenchendo o formulário que será exibido no console

<p align="right"><a href="#topo">topo</a></p>

## Contato

Instagram: <a href="https://www.instagram.com/elizandrodantas/" target="_blank">Elizandro Dantas</a>

**❤️ Donation ❤️:** `ce71c8ba-4c42-4a72-85b4-64fbe3ace08e` _chave aleatoria_ **NuBank 💜**

<p align="right"><a href="#topo">topo</a></p>