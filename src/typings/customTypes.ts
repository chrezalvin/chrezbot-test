import { ChrezBot } from "ChrezBot";
import {type Message, SlashCommandBuilder, Interaction, ClientEvents, Awaitable} from "discord.js";

export interface Command{
    name: string;
    execute: (message: Message) => void;
    unavailable?: boolean;
    description: string;
}

export interface EventReturnType<K extends keyof ClientEvents>{
    name: K;
    execute: (...args: ClientEvents[K]) => Awaitable<void>;
    eventType: "on" | "off" | "emit" | "once";
}

export interface CommandReturnTypes extends Command {
    alias?: string[];
    slash?:  {
        slashCommand: SlashCommandBuilder,
        interact: (interaction: Interaction) => void;
    }
}

export interface inlineCommandReturnTypes extends Command {
    searchCriteria: string | RegExp | string[] | RegExp[];
}

export function CommandReturnTypesChecking(obj: any): obj is CommandReturnTypes{
    if(typeof obj === "object"){
        const keys = ["name", "description", "execute"];
        for(const objKey of Object.keys(obj))
            if(keys.find((key) => key === objKey) === undefined) 
                return false;
    }
    
    return true;
}

export async function importModule<_T>(path: string, ensureType?: (x: any) => x is _T){
    let imported =  await import(`/${path}`) as unknown;
    if(imported != undefined && typeof imported === "object")
        if('default' in imported){
            imported = imported.default as _T;
        }
        else throw new Error(`Cannot found module default in the module ${path}`);
    else throw new Error("Cannot find the module");

    if(!ensureType) return imported as _T;
    else if(ensureType && ensureType(imported)) return imported;
    else throw new Error("imported path is not the expected type");
}