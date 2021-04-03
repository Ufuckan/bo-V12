const Discord = require('discord.js');

exports.run = function(client, message) {
const embed = new Discord.MessageEmbed()
.setColor('Blue')
.setTitle('Seviye Komutları')
.setTimestamp()
.addField('s+seviye','Seviyenizi atar.')
.addField('s+seviye-ayarlar','seviye komutlarının sunucudaki ayarlarını atar.')
.addField('s+seviye-aç','Seviye Sistemini açarsınız.')
.addField('s+seviye-kapat','Seviye sistemini kapatırsınız.')
.addField('s+seviye-log','Level atlayan kullanıcıları bu kanala atar.')
.addField('s+seviye-rol','Seviye ödülünü ayarlarsınız.')
.addField('s+seviye-xp','mesaj başına gelecek puanı ayarlarsınız.')
.setFooter('⭐ serius+BOT ⭐')
.setTimestamp()
.setThumbnail(client.user.avatarURL)
message.channel.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: false, 
  aliases: [], 
  permLevel: 0 
};

exports.help = {
  name: 'seviye-sistemi',
  description: 'Tüm komutları gösterir.',
  usage: 'yardım'
};