const debug = require("debug"); debug("Event:MessageCreate");

import { Client, Embed, EmbedBuilder, Events, GuildMember, Message, messageLink, version } from "discord.js";
import {CommandReturnTypes, EventReturnType} from "@typings/customTypes";

function CustomEvent(commands: CommandReturnTypes[]){
const event: EventReturnType<Events.MessageCreate> = {
    name: Events.MessageCreate,
    execute: async (message: Message) => {

    },
    eventType: "on"
}

return event;
}

export default event;