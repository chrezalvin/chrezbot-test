"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// idk why it wouldnt work on es6 import smh
const botDebug = require("debug")("Chrezbot:main");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const discord_js_1 = __importStar(require("discord.js"));
const customTypes_1 = require("./typings/customTypes");
// for resolving readdirsync scan on root project
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// async function importModule<_T>(path: string, ensureType?: (x: _T) => x is _T){
//     let imported =  await import(`${path}`) as any;
//     imported = imported.default as _T;
//     if(!ensureType) return imported as _T;
//     else if(ensureType && ensureType(imported)) return imported;
//     else throw new Error("imported path is not the expected type");
// }
const commands = new discord_js_1.Collection();
// const commands: CommandReturnTypes[] = [];
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const commandDir = fs_1.default.readdirSync(path_1.default.resolve(__dirname, "./commands"));
        for (const file of commandDir) {
            const a = yield (0, customTypes_1.importModule)(`./commands/${file}`);
            // commands.push(a);
            commands.set(a.name, a);
        }
        console.log(`commands available: ${commands.map(command => command.name)}`);
    });
})();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ]
});
client.once("ready", () => {
    console.log(`bot ready! running on discord ${discord_js_1.default.version}`);
});
// enable chat view option
client.on("messageCreate", (msg) => {
});
client.on("messageCreate", (msg) => {
    botDebug(`${msg.author.username}${msg.author.bot ? "(bot)" : ""}: ${msg.content}`);
    try {
        let get = commands.find(p => p.name === msg.content);
        if (get === undefined)
            return;
        botDebug(`received message command "${get.name}"`);
        get.execute(msg);
    }
    catch (error) {
        if (typeof error.message === 'string') {
            botDebug(`Error catched: ${error.message}`);
        }
        else if (typeof error === "string") {
            botDebug(`Error catched: ${error}`);
        }
        else if (typeof error === "object") {
            botDebug("Error caught no message found, full obj error:");
            botDebug(error);
        }
        else {
            botDebug("unknown error found");
        }
    }
});
client.on("interactionCreate", (interaction) => {
    // console.log(interaction.isCommand);
    if (interaction.isCommand()) {
        botDebug(`received interaction command "/${interaction.commandName}"`);
        console.log(interaction.commandName);
        interaction.reply("hi");
    }
});
client.login(process.env.DISCORD_TOKEN);
