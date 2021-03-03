import { ChildProcess, exec, execFile, spawn } from "child_process";
import { TextChannel, VoiceChannel } from "discord.js";
import { resolve } from "path";

export class ServerService {
  readonly serverName: string;
  readonly scriptCommand: string;

  private channelsToWatch: VoiceChannel[] = [];
  private channelsToMesssage: TextChannel[] = [];

  private monitorInterval: NodeJS.Timeout | undefined;

  private _isServerRunning: boolean = false;
  get isServiceRunning(): boolean {
    return this._isServerRunning;
  }

  private childProcess: ChildProcess | undefined;

  constructor(serverName: string, scriptCommand: string) {
    this.serverName = serverName;
    this.scriptCommand = scriptCommand;
  }

  toggleService(shouldServiceBeRunning: boolean, textChannel?: TextChannel, voiceChannel?: VoiceChannel) {
    if (this._isServerRunning === shouldServiceBeRunning) return;

    if (shouldServiceBeRunning) {
      if (voiceChannel === undefined || textChannel === undefined) {
        throw new Error('I need channels to look at!');
      }
      this.channelsToMesssage.push(textChannel);
      this.channelsToWatch.push(voiceChannel);
      this.turnOnServer();
    } else {
      this.turnOffServer();
    }
    this._isServerRunning = shouldServiceBeRunning;
  }

  private turnOnServer() {
    this.childProcess = spawn('cmd.exe', ['/c', this.scriptCommand])
    this.childProcess?.stderr?.on('data', (e) => console.error('ERROR', e.toString()));
    this.childProcess?.stdout?.on('data', (d) => console.log('DATA', d.toString()));
    this.childProcess.on('exit', () => console.log('Closed!'));

    this.monitorInterval = setInterval(() => {
      if (!this.checkChannelStatus()) {
        this.channelsToMesssage.forEach((channel) => channel.send('Nobody seems to be online!'));
        this.turnOffServer();
      }
    }, 600000);
  }

  private turnOffServer() {
    if (this.monitorInterval !== undefined) {
      clearInterval(this.monitorInterval);
    }

    const timeout = 60000
    this.channelsToWatch = [];
    const channels: TextChannel[] = [];
    this.channelsToMesssage.forEach((channel) => {
      channel.send(`@here server will shut down in ${timeout / 1000} seconds!`);
      channels.push(channel);
    });
    this.channelsToMesssage = [];

    setTimeout(() => {
      this.childProcess?.kill('SIGINT');
      channels.forEach((channel) => channel.send('Server was turned off!'));
    }, timeout);
  }

  private checkChannelStatus(): boolean {
    let wasUserFound = false;

    for (let channel of this.channelsToWatch) {
      if (channel.members.size !== 0) {
        wasUserFound = true;
        break;
      }
    }

    return wasUserFound;
  }
}