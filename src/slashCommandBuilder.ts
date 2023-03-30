import {SlashCommandBuilder, REST, Routes, Client, GatewayIntentBits, Guild} from "discord.js";
import {CommandReturnTypes} from "@typings/customTypes";

import dotenv from "dotenv"; dotenv.config();
import fs from 'fs';
import path from "path";

import ReadLine from "readline";
import util from "util";


const readline = ReadLine.createInterface({input: process.stdin, output: process.stdout});
// const question = util.promisify(readline.question).bind(readline);

// locally asks for prompt
async function question(message:string){
    return new Promise<string>((res, rej) => {
        readline.question(message, async ans => {
            readline.close();
            readline.removeAllListeners();
            
            res(ans);
            
        })
    })
}

async function importModule<_T>(path: string, ensureType?: (x: _T) => x is _T): Promise<_T>{
    let imported =  await import(`${path}`) as any;
    imported = imported.default as _T;

    if(!ensureType) return imported;
    else if(ensureType && ensureType(imported)) return imported;
    else throw new Error("imported path is not the expected type");
}

// checking discord token
const {mode} = process.env; // production | development

if(process.env.DISCORD_TOKEN === undefined)
    throw new Error("no token set on environtment variable!");

const files = fs.readdirSync(path.resolve(__dirname, "./commands"));
const slashCommands: SlashCommandBuilder[] = [];

const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN);

(async() => {
    try{
        for(const file of files){
            const {slash} = await importModule<CommandReturnTypes>(`./commands/${file}`);
            if(slash !== undefined)
                slashCommands.push(slash.slashCommand);
        }

        // Create preview for slash commands
        console.log("getting all the slash commands, here's the list of all the commands:\n" +
            slashCommands.map(
                slashCommand => {
                    return `${slashCommand.name} - ${slashCommand.description}`
                }).join("\n")
        )

        let data: string[] = [];
        if(process.env.APPLICATION_ID === undefined)
            throw new Error("couldn't find the application id for this environtment!");

        const answer = await question("Note: This process will refresh all your slash command on discord server, do you wish to proceed?\n(y/n | yes/no): ");
        if(answer === 'n' || answer === "no") {
            console.log("exiting the process");
            process.exit(0);
        }


        console.log("updating the slash commands to discord server");
        data = await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), 
                                    {body: slashCommands}) as string[];

        console.log(`successfully reloaded ${data.length} of data`)
    }
    catch(error){
        if(typeof error === "object" && 'message' in error!){
            console.log(`error: ${error.message}`
            );
        }
        else
            console.log(`Error: ${error}`);
    }
})();