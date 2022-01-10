import { Client, Intents } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { readFileSync } from 'fs';
import turtle from './turtle';
import { WebSocket } from 'ws';

export default class discord {
    client: Client;
    commands: Array<Object>;
    rest: REST;
    applicationId: any;
    turtle: turtle | undefined;
    constructor(commands: Array<Object>) {
        this.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
        this.commands = commands;
        this.rest = new REST({ version: '9' }).setToken((JSON.parse(readFileSync('./settings.json').toString())).token);
        this.applicationId = (JSON.parse(readFileSync('./settings.json').toString())).appid;
        this.guildId = (JSON.parse(readFileSync('./settings.json').toString())).guildid;
    }

    addTurtle(turtle: turtle) {
        this.turtle = turtle;
    }

    async refreshCommands() {
        try {
            console.log('Refreshing / commands');

            await this.rest.put(
                Routes.applicationGuildCommands(this.applicationId, this.guildId),
                { body: this.commands }
            );
            console.log("Successfully reloaded / commands");
        } catch (err) {
            console.error(err);
        }
    }

    async start() {
        this.client.on('ready', async () => {
            // Refresh the slash commands
            await this.refreshCommands();
            console.log('The bot has logged on..')
        });

        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;

            if (interaction.commandName === 'test') {
                await interaction.reply('It worked...');
            } else if (interaction.commandName == 'forward') {
                if (this.turtle) {
                    this.turtle?.moveForward();
                    await interaction.reply('Moved the turtle forward..');
                } else {
                    await interaction.reply('No turtle is connected');
                }
            } else if (interaction.commandName == 'eval') {
                if (this.turtle) {
                    console.log(interaction.options.data[0].value);
                    this.turtle?.eval(String(interaction.options.data[0].value));
                    interaction.reply("OK BOOMER");
                }
            }
        });

        this.client.login((JSON.parse(readFileSync('./settings.json').toString())).token);
    }

    getClient() {
        return this.client;
    }
}
