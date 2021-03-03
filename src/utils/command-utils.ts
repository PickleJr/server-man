import { Collection } from "discord.js";
import { ICommand } from "../models/command.model";
import { ServerService } from "../services/server-service";
import * as Commands from '../commands';
import * as Config from '../config.json';

export const initCommands = (): Collection<string,ICommand> => {
  const result = new Collection<string,ICommand>();

  const valheimServer = new ServerService('Valheim', Config.scripts.valheim.command);

  const servers = [valheimServer];
  const onCommand = new Commands.OnCommand(servers);
  const offCommand = new Commands.OffCommand(servers);
  const statusCommand = new Commands.StatusCommand(servers);

  result.set(onCommand.name, onCommand);
  result.set(offCommand.name, offCommand);
  result.set(statusCommand.name, statusCommand);
  
  return result;
};