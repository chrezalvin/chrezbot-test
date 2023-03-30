"use strict";
// const debug = require("debug"); debug("Event:MessageCreate");
// import { Client, Events, Message, version } from "discord.js";
// let a = {b: "c"};
// a.c = "d";
// module.exports = {
//     name: Events.MessageCreate,
//     execute: (message: Message) => {
//         debug(`${message.author.username}${message.author.bot ? "(bot)": ""}: ${message.content}`)
//         try{
//             let get = commands.find(p => p.name === message.content)
//             if(get === undefined) return;
//             debug(`received message command "${get.name}"`);
//             get.execute(message);
//         }
//         catch(error: any){
//             if(typeof error.message === 'string'){
//                 debug(`Error catched: ${error.message}`);
//             }
//             else if(typeof error === "string"){
//                 debug(`Error catched: ${error}`);
//             }
//             else if(typeof error === "object"){
//                 debug("Error caught no message found, full obj error:");
//                 debug(error);
//             }
//             else{
//                 debug("unknown error found");
//             }
//     }
// }
