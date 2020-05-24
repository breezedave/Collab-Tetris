const Discord = require('discord.js');
const fs = require('fs');
const socket = require('socket.io');
const Gameboy = require('./lib/gameboy.js');
const auth = require("./auth.json");

class Server {
        constructor(PORT_NO) {
            const self = this;

            this.bot = new Discord.Client();
            this.token = auth.token;
            this.io = socket(PORT_NO);
            this.gameboy = new Gameboy();

            this.bot.on("ready", self.serverReady);
            this.bot.on("message", self.messageReceived);
            this.bot.login(this.token);
        }

        serverReady(evt) {
            console.log("Ready");
        }

        messageReceived = (message) => {
            let key;

            if(message.channel.name.toLowerCase() !== "tetris") return;
            switch(message.content.toLowerCase()) {
                case "w":
                    key = 38;
                    break;
                case "s":
                    key = 40;
                    break;
                case "a":
                    key = 37;
                    break;
                case "d":
                    key = 39;
                    break;
                case "c":
                    key = 90;
                    break;
                case "v":
                    key = 88;
                    break;
                /*
                case "enter":
                    key = 13;
                case "select":
                    key = 16;
                */
                default:
                    return;
            }

            this.gameboy.joypad.keyDown(key);
            setTimeout(() => this.gameboy.joypad.keyUp(key), 50);
        }

        initTetris() {
            const self = this;

            self.gameboy.loadCart(fs.readFileSync('./tetris.gb'));
            self.gameboy.start();
            self.renderScreen();
            setTimeout(() => {
                self.pressEnter()
                .then(() => self.pressEnter())
                .then(() => self.pressEnter());
            }, 3500);
        }

        pressEnter() {
            const self = this;

            return new Promise((resolve) => {
                self.gameboy.joypad.keyDown(13);
                setTimeout(() => {
                    self.gameboy.joypad.keyUp(13);
                    setTimeout(() => resolve(), 3500);
                }, 50);
            });
        }

        renderScreen() {
            let i = 0;
            const self = this;

            self.gameboy.gpu.on('frame', (canvas) => {
                if (++i % 2) return;
                self.io.emit('frame', canvas.toDataURL());
                i = 0;
            });
        }
}

const server = new Server(3000);

server.initTetris();
