const { Client, MessageAttachment, Intents, MessageEmbed, MessageActionRow, MessageButton, Permissions, VoiceChannel, Channel } = require('discord.js');
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"] });
const { token } = require('./config.json');
var fs = require('fs');
var cron = require("cron");

/* server */
const express = require('express');
const app = express();
const PORT = 7400;

app.use(express.static('public'));
app.use('/images', express.static('images'));

// Server setup
app.listen(PORT, () => {
    console.log(`Running server on PORT ${PORT}...`);
})

var coachFiles = fs.readdirSync('./assets/images/coach');
var hopOnFiles = fs.readdirSync('./assets/l4d/play_l4d2')
var coachMeme = [];
var playL4D2 = [];
for (let i = 0; i < coachFiles.length; i++) {
    coachMeme.push('./assets/images/coach/' +coachFiles[i]);
}
//----
for (let i = 0; i <hopOnFiles.length; i++) {
    playL4D2.push('./assets/l4d/play_l4d2/' + hopOnFiles[i]);
}
console.log("Play L4D2|", playL4D2)
console.log("Coach Meme |", coachMeme)


// ⏣
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.forEach(guild => {
        console.log(`${guild.name} | ${guild.id}`);
    })

    //client.user.

    client.user.setActivity("Left 4 Dead 2", {
        type: "PLAYING"
        //type: "STREAMING",
        //url: "https://www.twitch.tv/sleepyrapunzel"
    });

    const activities = [
        {
            type: "WATCHING",
            activity: "Left 4 Dead 3",
        },
        {
            type: "PLAYING",
            activity: "Left 4 Dead 2"
        }

    ];
    /*
    const timeoutForNms = 3600000; // 10 seocnds
    let currentActivity = 0;
    setInterval(() => {
        console.log('set activity to %s type to %s', activities[currentActivity].activity, activities[currentActivity].type);
        client.user.setActivity(`${activities[currentActivity].activity}`, { type: `${activities[currentActivity].type}` });
        currentActivity++;
        if (currentActivity === activities.length) {
            currentActivity = 0;
        }
    }, timeoutForNms);
    */
    let currentActivity = 0;
    var statusCron = new cron.CronJob('0 * * * *', function () {
        console.log('set activity to %s type to %s', activities[currentActivity].activity, activities[currentActivity].type);
        client.user.setActivity(`${activities[currentActivity].activity}`, { type: `${activities[currentActivity].type}` });
        currentActivity++;
        if (currentActivity === activities.length) {
            currentActivity = 0;
        }

    
      });
      statusCron.start();
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;

    switch (commandName) {

        case "coach":
            var file = coachMeme[Math.floor(Math.random() * coachMeme.length)]
            await interaction.reply({ files: [`${file}`] })
            break;
        case "gif":
            //const args = interaction.options.get('id').value;
            const _choice = interaction.options.get('category').value;
            if (_choice == 'gif_l4d') {
                return await interaction.reply({ files: ['./assets/l4d/gif/hop-on-left4dead2-left.gif'] })
            }
            if (_choice == 'gif_meme') {
                return await interaction.reply("Meme")
            }
            else {
                console.log("Idk")
            }

            break;
        case "help":
            const helpEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle("Coach's Helpful Command List! 🔥")
                .setURL('https://l4d2.punzia.com/')
                .setAuthor({ name: 'Coach', iconURL: 'https://i.imgur.com/JzpDWOz.png', url: 'https://l4d2.punzia.com/' })
                .setThumbnail('https://l4d2.punzia.com/img/Left_4_Dead_2_logo.png')
                .setDescription('Some helpful list of commands!')
                .addFields(
                    { name: '``/help``', value: 'Shows this command!' },
                    { name: '``/coach``', value: 'Posts an image/gif of Coach!' },
                    { name: '``/gif``', value: 'Posts a gif in chosen category' },
                    { name: '``/l4d2``', value: 'Tell a special person to play Left 4 Dead 2 with you~' },
                )
                .setTimestamp()
                .setFooter({ text: 'Coach', iconURL: 'https://i.imgur.com/JzpDWOz.png' });

            await interaction.reply({ embeds: [helpEmbed], ephemeral: true  });
            break;
        case "l4d2":
            const _friend = interaction.options.get('friend').value;
            //const _file = new MessageAttachment('./assets/l4d/gif/hop-on-left4dead2-left.gif');
            //await interaction.channel.send(`Hey ${interaction.user} wants to play Left 4 Dead 2 with you ${_friend}`, _file)
            await interaction.deferReply();
            await interaction.deleteReply();
            var _playL4D2 = playL4D2[Math.floor(Math.random() * playL4D2.length)]
            //interaction.channel.send("dummy message");
            await interaction.channel.send({ content: `Hey ${interaction.user} wants to play Left 4 Dead 2 with you ${_friend}! 💗`, files: [`${_playL4D2}`], fetchReply: false })
            //.then((message) => message.delete())
            //.catch(console.error);
            break;

    }

})

client.login(token)
