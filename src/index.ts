import { Client } from 'discord.js';
import { prefix, token } from './config.json';
import * as CommandUtils from './utils/command-utils';

const client = new Client();
const commands = CommandUtils.initCommands();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/);
	const command = args.shift()?.toLowerCase();

	if (command === undefined || !commands.has(command)) return;

	try {
		commands.get(command)?.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});


client.login(token);