import {} from 'sequelize';

// idk why it wouldnt work on es6 import smh
const debug = require("debug")("Chrezbot:main");

import dotenv from "dotenv"; dotenv.config();
import Discord, { Client, ClientEvents, ClientUser, Embed, EmbedBuilder, GatewayIntentBits, Guild, TextChannel } from "discord.js";
import {type CommandReturnTypes, importModule, EventReturnType} from "@typings/customTypes";
import { ChrezBot } from "ChrezBot";

import registlet from "./datas/registlet.json";
import combotags from "./datas/combotag.json";
import levellings from "./datas/levelling.json";

// for resolving readdirsync scan on root project
import path from "path";
import fs from "fs";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

// client.on('ready', async () => {
//     const id = '1090209996039540776';
//     const ch = await client.channels.fetch("823744668670885899");
//     (ch as TextChannel).send()
// })

client.on("messageCreate", async (message) => {
    if(message.content === "here"){
        // message.channel.send({embeds: [new EmbedBuilder()
        //                         .setTitle("level 1 - 20").setDescription("**Options**:")
        //                         .setFields(
        //                             {name: "Colon", value: "Rugio Ruins", inline: true},
        //                             {name: "Goblin", value: "Ruined Temple: A2", inline: true},
        //                             {name: "Skeleton", value: "Zokzdta Ruins", inline: true},
        //                         )
        //                         .setColor("Yellow")
        //                     ]});
        message.channel.send({embeds: [new EmbedBuilder()
                                .setTitle("level 1 - 20")
                                .setThumbnail("https://static.wikia.nocookie.net/toram/images/8/88/Colon.png/revision/latest?cb=20150918061311")
                                .setFields(
                                    {name: "Colon", value: "Rugio Ruins"},
                                )
                                .setColor("Yellow")
                            ]});
    }
    if(message.content !== "bulkdelete") return;

    try{
    const msg = await (message.channel as TextChannel).bulkDelete(100);
    message.channel.send(`successfully deleted ${msg.size} messages`);
    }
    catch(e: any){
        console.log("failed to delete message");
    }
})

client.on('ready', () => {console.log(`bot ready! ${registlet.length}`)});

client.on('ready', async () => {
    const flag = false;
    if(flag) return;

    const guildID = "739696962097512449"; // cphoenix
    // const guildID = "822912738875146261"; // cb test
    const channelID = "1084514288925949992"; // cphoenix
    // const channelID = "823744668670885899"; // cb test
    const index: {name: String, value: String}[] = [];

    const ch = await client.channels.fetch(channelID);

    if(ch === undefined)
        throw new Error("channel is undefined!");

    const targs = [levellings[0], levellings[1], levellings[2], levellings[3], levellings[4]]

    for(const targ of levellings){
        const embed = createEmbedForLevelling(targ);
        const { id } = await (ch as TextChannel).send({embeds: [
            embed
        ]})

        index.push({name: `Level ${targ.level}`, value: id});
    }

let section: String[] = [];

section.push(index.slice(0, 25).map((val, idx) => `**${idx + 1}.** [${val.name}](https://discord.com/channels/${guildID}/${channelID}/${val.value})`).join('\n'))
// section.push(index.slice(26, 50).map((val, idx) => `**${idx + 26}.** [${val.name}](https://discord.com/channels/${guildID}/${channelID}/${val.value})`).join('\n'))
// section.push(index.slice(51, 75).map((val, idx) => `**${idx + 51}.** [${val.name}](https://discord.com/channels/${guildID}/${channelID}/${val.value})`).join('\n'))
// section.push(index.slice(76, 100).map((val, idx) => `**${idx + 76}.** [${val.name}](https://discord.com/channels/${guildID}/${channelID}/${val.value})`).join('\n'))
// section.push(index.slice(101, index.length).map((val, idx) => `**${idx + 101}.** [${val.name}](https://discord.com/channels/${guildID}/${channelID}/${val.value})`).join('\n'))

for(const sect of section){
    const embed = new EmbedBuilder()
        .setColor('White')
        .setTitle("Toram Levelling Index List")
        .setThumbnail("https://cdn.discordapp.com/attachments/739696962097512452/1090279895847940238/image0.jpg")
        .setDescription(`Please select the **blue text** below to guide you to the selected levelling range\n ${sect}`)
        .setFooter({text: "you can use pinned message to quickly go back here", iconURL: "https://media.discordapp.net/attachments/970318433994571836/971364635196411944/pushpin.png"});

        (ch as TextChannel).send({embeds: [embed]});
}

})

interface Registlet{
    name: string;
    maxLevel: number;
    description: string;
    stoodie: number[];
    imgThumbnail?: string;
}

function createEmbedForRegistlet(registlet: Registlet){
    const embed = new EmbedBuilder()
    .setTitle(registlet.name)
    .addFields(
        {name: "Max Level", value: `${registlet.maxLevel}`},
        {name: "Description", value: registlet.description},
    )
    .setColor('Yellow')
    .setFooter({text: `available at stoodie level ${registlet.stoodie.join(", ")}`});

    if(registlet.imgThumbnail)
        embed.setThumbnail(registlet.imgThumbnail);

    return embed;
}

interface Combotag{
    name: string;
    description: string[];
    examples?: string[];
    thumbnail?: string;
    footer?: string;
}

function createEmbedForCombotag(combotag: Combotag){
    const embed = new EmbedBuilder()
        .setTitle(combotag.name)
        .setFields({name: "Description", value: combotag.description.map(example => example.replace(/^\*/, "\* ")).join('\n')})
        .setColor("Yellow");

    if(combotag.thumbnail)
        embed.setThumbnail(combotag.thumbnail);

    if(combotag.examples)
        embed.addFields({name: "Examples", value: combotag.examples.join('\n\n')});

    if(combotag.footer)
        embed.setFooter({text: combotag.footer, iconURL: "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Information_icon.svg/2048px-Information_icon.svg.png"})

    return embed;
}

interface Levelling{
    level: string;
    description?: string;
    mobs: {name: string, location: string, level: string, difficulty?: string, corynID?: string}[];
    footer?: string;
}

function createEmbedForLevelling(leveling: Levelling){
    const embed = new EmbedBuilder().setTitle(`Level ${leveling.level}`).setColor("Yellow");
    if(leveling.description)
        embed.setDescription(leveling.description);

    if(leveling.footer)
        embed.setFooter({text: leveling.footer, iconURL: "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Information_icon.svg/2048px-Information_icon.svg.png"});

    for(const mob of leveling.mobs)
        embed.addFields({name: `${mob.name}${mob.difficulty ? ` [${mob.difficulty}]`: ""} (lv ${mob.level})`, value: `${mob.location}${mob.corynID ? `\n[coryn](https://coryn.club/monster.php?id=${mob.corynID})`: ""}`, inline: true});

    return embed;
}

// const client = new ChrezBot({
//     intents: [
//         GatewayIntentBits.Guilds, 
//         GatewayIntentBits.GuildMessages, 
//         GatewayIntentBits.MessageContent,
//     ] 
// });

// ( async function() {

//     const commandDir = fs.readdirSync(path.resolve(__dirname, "./commands"));
//     const eventDir = fs.readdirSync(path.resolve(__dirname, "./events"))

//     for(const file of commandDir){
//         const a = await importModule<CommandReturnTypes>(`./commands/${file}`);
//         // commands.push(a);
//         client._commands.set(a.name, a);
//     }

//     for(const file of eventDir){
//         const a = await importModule<EventReturnType<keyof ClientEvents>>(`./events/${file}`);
//         client._events.set(a.name, a);
//     }

//     debug(`commands available: ${client._commands.map(command => command.name)}`);

//     try{
//         for(const [name, event] of client._events){
//             debug(`register command ${name} on event ${event.eventType}`);
//             switch(event.eventType){
//                 case 'emit': client.emit(name, event.execute); break;
//                 //                                     bruh vvv
//                 case 'on': client.on(name, event.execute as any); break;
//                 case 'off': client.off(name, event.execute as any); break;
//                 case 'once': client.once(name, event.execute as any); break;
//                 default: throw new Error("Error!");
//             }
//         }
//     }
//     catch(error){
//         debug(`catch error ${error}`);
//     }
// })();

// client.once("ready", () => {
//     console.log(`bot ready! running on discord ${Discord.version}`)
// })
// // enable chat view option
// client.on("messageCreate", (msg) => {
// })

// client.on("messageCreate", (msg) => {
//     debug(`${msg.author.username}${msg.author.bot ? "(bot)": ""}: ${msg.content}`)

//     try{

//         let get = client._commands.find(p => p.name === msg.content)
//         if(get === undefined) return;
//         debug(`received message command "${get.name}"`);
        
//         get.execute(msg);
//     }
//     catch(error: any){
//         if(typeof error.message === 'string'){
//             debug(`Error catched: ${error.message}`);
//         }
//         else if(typeof error === "string"){
//             debug(`Error catched: ${error}`);
//         }
//         else if(typeof error === "object"){
//             debug("Error caught no message found, full obj error:");
//             debug(error);
//         }
//         else{
//             debug("unknown error found");
//         }
//     }
// })

// client.on("interactionCreate", (interaction) => {
//     // console.log(interaction.isCommand);
//     if(interaction.isCommand()){
//         debug(`received interaction command "/${interaction.commandName}"`);
//         console.log(interaction.commandName);
//         interaction.reply("hi");
//     }
// })

client.login(process.env.DISCORD_TOKEN)