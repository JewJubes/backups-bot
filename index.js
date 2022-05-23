const fs = require('fs');
const cron = require('node-cron');
const backup = require("discord-backup");
const Discord = require('discord.js');
backup.setStorageFolder(__dirname+"/backups/");
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES
    ]
});

const config = require('./config.json');
client.config = config;

/* Load all events */
fs.readdir("./events/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`👌 Event loaded: ${eventName}`);
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

client.commands = new Discord.Collection();

/* Load all commands */
fs.readdir("./commands/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
        console.log(`👌 Command loaded: ${commandName}`);
    });
});

// Auto backup

client.on("ready", () => {
    console.log("Let's do this!");
    
        const channel = client.channels.cache.get('x');
        const CronJob = require('cron').CronJob;
        
let autobackup = new CronJob ("0 1 * * *", function() {
console.log("Backing up now!");
channel.send('Daily Backup starting now.');
   backup.create(channel.guild, {maxMessagesPerChannel: 9999999, jsonSave: true, jsonBeautify: true, saveImages: "base64"})
        }, null, true, 'America/Toronto);
    autobackup.start();
    
});



// Login
client.login(config.token);



