// import {CommandReturnTypes} from "@typings/customTypes";

// const {Message} = require('discord.js');
// // const {createEmbed} = require('../../functions/createEmbed');
// // const {getRandomValue} = require('../../functions/getRandomValue');

// /**
//  * @param {Array} arguments
//  */

// module.exports = {
//     name: "roll",
//     alias: ["dice", "random"],
//     description: "rolls 0 - number if defined, rolls a die otherwise",
//     syntax: "roll <number>",
//     execute(message, arguments){
        
//         // check if argument[0] is valid
//         let max = parseInt(arguments.shift());
//         if(isNaN(max))
//             max = 6;
        
//         let myEmbed;
//         if(max == 6)
//             myEmbed = createEmbed(`Rolls a die`, `You rolled a die and got ${getRandomValue(1, max)}!`);
//         else
//             myEmbed = createEmbed(`Rolls a number between 0 - ${max}`, `I rolled a ${getRandomValue(1, max)}!`);

//         message.channel.send({embeds: [myEmbed]});
//     }
// }

// import { SlashCommandBuilder } from "discord.js";

// const command: CommandReturnTypes = {
//     name: "roll",
//     alias: ["dice", "random"],
//     description: "rolls 0 - number if defined, rolls a die otherwise",
//     execute: (message) => {
//         // check if argument[0] is valid
//         let max = parseInt(arguments.shift());
//         if(isNaN(max))
//             max = 6;
        
//         let myEmbed;
//         if(max == 6)
//             myEmbed = createEmbed(`Rolls a die`, `You rolled a die and got ${getRandomValue(1, max)}!`);
//         else
//             myEmbed = createEmbed(`Rolls a number between 0 - ${max}`, `I rolled a ${getRandomValue(1, max)}!`);

//         message.channel.send({embeds: [myEmbed]});
//     },
//     slash:{
//         slashCommand: new SlashCommandBuilder().setName("hello").setDescription("Says hello"),
//         interact: (interaction) => {
//             if(!interaction.isCommand())
//                 throw new Error("Bot can't reply the interaction received");

//             interaction.reply(`Hello, ${interaction.member?.user.username}!`);
//         }
//     }
// };

// export default command;