const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const { Client, Util } = require('discord.js');
require('./util/eventLoader.js')(client);
const fs = require('fs');
const  db  = require('wio.db')


var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

///////////////////////eklendim atıldım

client.on('guildDelete', guild => {

    let Crewembed = new Discord.MessageEmbed()
    
    .setColor("RED")
    .setTitle(" ATILDIM !")
    .addField("Sunucu Adı:", guild.name)
    .addField("Sunucu sahibi", guild.owner)
    .addField("Sunucudaki Kişi Sayısı:", guild.memberCount)
    
       client.channels.cache.get('784906432419069962').send(Crewembed);
      
    });
    
    
    client.on('guildCreate', guild => {
    
    let Crewembed = new Discord.MessageEmbed()
    
    .setColor("GREEN")
    .setTitle("EKLENDİM !")
    .addField("Sunucu Adı:", guild.name)
    .addField("Sunucu sahibi", guild.owner)
    .addField("Sunucudaki Kişi Sayısı:", guild.memberCount)
    
       client.channels.cache.get('784906432419069962').send(Crewembed);
      
    });


//seviye//
    client.on("message", async message => {
        let prefix = ayarlar.prefix;
      
        var id = message.author.id;
        var gid = message.guild.id;
      
        let hm = await db.fetch(`seviyeacik_${gid}`);
        let kanal = await db.fetch(`svlog_${gid}`);
        let xps = await db.fetch(`verilecekxp_${gid}`);
        let seviyerol = await db.fetch(`svrol_${gid}`);
        let rollvl = await db.fetch(`rollevel_${gid}`);
      
        if (!hm) return;
        if (message.content.startsWith(prefix)) return;
        if (message.author.bot) return;
      
        var xp = await db.fetch(`xp_${id}_${gid}`);
        var lvl = await db.fetch(`lvl_${id}_${gid}`);
        var xpToLvl = await db.fetch(`xpToLvl_${id}_${gid}`);
      
        if (!lvl) {
          
          if (xps) {
            db.set(`xp_${id}_${gid}`, xps);
          }
          db.set(`xp_${id}_${gid}`, 4);
          db.set(`lvl_${id}_${gid}`, 1);
          db.set(`xpToLvl_${id}_${gid}`, 100);
        } else {
          if (xps) {
            db.add(`xp_${id}_${gid}`, xps);
          }
          db.add(`xp_${id}_${gid}`, 4);
      
          if (xp > xpToLvl) {
            db.add(`lvl_${id}_${gid}`, 1);
            db.add(
              `xpToLvl_${id}_${gid}`,
              (await db.fetch(`lvl_${id}_${gid}`)) * 100
            );
            if (kanal) {
              client.channels
                .cache.get(kanal.id)
                .send(
                  message.member.user.username +
                    " **Seviye Atladı!** Yeni seviyesi; " +
                    lvl +
                    " **Tebrikler!** :white_circle: "
                );
      
              
            }
         
          }
      
          if (seviyerol) {
            if (lvl >= rollvl) {
              message.guild.member(message.author.id).addRole(seviyerol);
              if (kanal) {
                client.channels
                  .get(kanal.id)
                  .send(
                    message.member.user.username +
                      " Yeni Seviyesi " +
                      rollvl +
                      "  seviyeye ulaştı ve " +
                      seviyerol +
                      " Rolünü kazandı! :white_circle: "
                  );
              }
            }
          }
        }
      
        
      });
      //seviye//
      
    
      client.on("guildMemberAdd", async(member) => {
        let system = await db.fetch(`welcome.ch_${member.guild.id}`)  
        if(!system) return;
        const canvacord = require('canvacord')
      
        const sa = new canvacord.Welcomer()
      .setUsername(member.user.username)//ellemeyin
      .setDiscriminator(member.user.discriminator)//ellemeyin//ellemeyin
      .setMemberCount(member.guild.memberCount)//ellemeyin
      .setGuildName(member.guild.name)//ellemeyin
      .setAvatar(member.user.avatarURL({dynamic: true, format: "png", size: 1024}))//ellemeyin
      .setColor("border", "#8015EA")//ellemeyin
      .setColor("username-box", "#8015EA")//ellemeyin
      .setColor("discriminator-box", "#8015EA")//ellemeyin
      .setColor("message-box", "#8015EA")//ellemeyin
      .setColor("title", "#8015EA")//ellemeyin
      .setColor("avatar", "#8015EA")//ellemeyin
      .setText("title", `Hoşgeldin`)//yazıları değiştirin sadece title değiştirmeyin
      .setText("message", `Hoşgeldiniz ${member.guild.name}`)//yazıları değiştirin sadece message değiştirmeyin
      
      sa.build()
          .then(data => {
              const attachment = new Discord.MessageAttachment(data, "WelcomeCard1.png");
              client.channels.cache.get(system).send(attachment)
          });
      
      })
      
     


      client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});



client.on("guildMemberAdd", async(member) => {
    let system = await db.fetch(`welcome.ch_${member.guild.id}`)  
    if(!system) return;
    const canvacord = require('canvacord')
  
    const sa = new canvacord.Welcomer()
  .setUsername(member.user.username)//ellemeyin
  .setDiscriminator(member.user.discriminator)//ellemeyin//ellemeyin
  .setMemberCount(member.guild.memberCount)//ellemeyin
  .setGuildName(member.guild.name)//ellemeyin
  .setAvatar(member.user.avatarURL({dynamic: true, format: "png", size: 1024}))//ellemeyin
  .setColor("border", "#8015EA")//ellemeyin
  .setColor("username-box", "#8015EA")//ellemeyin
  .setColor("discriminator-box", "#8015EA")//ellemeyin
  .setColor("message-box", "#8015EA")//ellemeyin
  .setColor("title", "#8015EA")//ellemeyin
  .setColor("avatar", "#8015EA")//ellemeyin
  .setText("title", `Hoşgeldin`)//yazıları değiştirin sadece title değiştirmeyin
  .setText("message", `Hoşgeldiniz ${member.guild.name}`)//yazıları değiştirin sadece message değiştirmeyin
  
  sa.build()
      .then(data => {
          const attachment = new Discord.MessageAttachment(data, "WelcomeCard1.png");
          client.channels.cache.get(system).send(attachment)
      });
  
  })
  
 

client.login(ayarlar.token);