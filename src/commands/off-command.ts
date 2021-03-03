import { Message } from 'discord.js';
import { ICommand } from '../models/command.model';
import { ServerService } from '../services/server-service';

export class OffCommand implements ICommand {
  readonly name: string = 'off';
  readonly description: string = "Turn a server off.";

  private readonly servers: Map<string,ServerService> = new Map();

  constructor(servers: ServerService[]) {
    servers.forEach((server) => this.servers.set(server.serverName, server));
  }

  execute(message: Message, args: string[]) {
    let isServerFound = false;
    this.servers.forEach((v, k) => {
      if (args.includes(k.toLowerCase())) {
        isServerFound = true;
        v.toggleService(false);
      };
    });

    if (!isServerFound) {
      message.channel.send(`What the HECK are you talking about. I don't know what server you're asking for`);
    }
  }
}