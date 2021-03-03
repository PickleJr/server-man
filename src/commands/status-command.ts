import { Message } from 'discord.js';
import { ICommand } from '../models/command.model';
import { ServerService } from '../services/server-service';

export class StatusCommand implements ICommand {
  readonly name: string = 'status';
  readonly description: string = "Check if the server is up or not.";

  private readonly servers: Map<string,ServerService> = new Map();

  constructor(servers: ServerService[]) {
    servers.forEach((server) => this.servers.set(server.serverName, server));
  }

  execute(message: Message, args: string[]) {
    let isServerFound = false;
    this.servers.forEach((v, k) => {
      if (args.includes(k.toLowerCase())) {
        isServerFound = true;
        message.channel.send(`Server status for ${k}: ${v.isServiceRunning ? 'Up' : 'Down'}`);
      };
    });

    if (!isServerFound) {
      message.channel.send(`What the HECK are you talking about. I don't know what server you're asking for`);
    }
  }
}