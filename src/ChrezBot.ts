import { CommandReturnTypes, EventReturnType } from "@typings/customTypes";
import { Awaitable, Client, ClientEvents, ClientOptions, Collection, Events } from "discord.js";

// extends the command files from Client
export class ChrezBot extends Client{
    _events: Collection<string, EventReturnType<keyof ClientEvents>>;
    _commands: Collection<string, CommandReturnTypes>;

    constructor(options: ClientOptions, events: EventReturnType<keyof ClientEvents>[], commands: CommandReturnTypes[]){
        super(options);
        this._events = new Collection();
        this._commands = new Collection();

        events.forEach(event => this._events.set(event.name, event));
        commands.forEach(command => this._commands.set(command.name, command));

        this._events.forEach((event) => {
            switch(event.eventType){
                case 'emit': this.emit(event.name as any, event.execute); break;
                case 'on': this.on(event.name, event.execute); break;
                case 'once': this.once(event.name, event.execute); break;
                case 'off': this.off(event.name, event.execute); break;
                default: {
                    console.log(`event for ${event.eventType} skipped`);
                }
            }
        })

        this.login();
    }


}

// class BlockList{
//     constructor(){
//         import("./datas/blocklist.json");
//     }
// }