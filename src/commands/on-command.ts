import publicIp from 'public-ip';
import { Message, TextChannel } from 'discord.js';
import { ICommand } from '../models/command.model';
import { ServerService } from '../services/server-service';
import { scripts } from '../config.json';

export class OnCommand implements ICommand {
  readonly name: string = 'on';
  readonly description: string = "Turn a server on.";

  private readonly servers: Map<string, ServerService> = new Map();

  constructor(servers: ServerService[]) {
    servers.forEach((server) => this.servers.set(server.serverName, server));
  }

  execute(message: Message, args: string[]) {
    let isServerFound = false;
    this.servers.forEach((v, k) => {
      if (args.includes(k.toLowerCase()) && message.member?.voice.channel != null) {
        isServerFound = true;
        v.toggleService(true, message.channel as TextChannel, message.member.voice.channel);
        message.channel.send(`Server status for ${k}: ${v.isServiceRunning ? 'Up' : 'Down'}`);
        this.printServerInfo(message.channel as TextChannel);
        message.channel.send('Please wait a few minutes for the server to become discoverable.');
      } else if (args.includes(k.toLowerCase())) {
        isServerFound = true;
        message.channel.send('You need to be on a voice channel to turn on a server!');
      }
    });

    if (!isServerFound) {
      message.channel.send(`What the HECK are you talking about. I don't know what server you're asking for`);
    }
  }

  private printServerInfo = async (channel: TextChannel) => {
    channel.send(`No easy URL yet!\nIP to go to is\`${(await publicIp.v4())}:${scripts.valheim.port}\`.`);
    channel.send(`Password: \`${scripts.valheim.password}\``);
  }
}