"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    execute: (client) => {
        console.log(`Bot ready! Running on Discord ${discord_js_1.version}`);
    }
};
