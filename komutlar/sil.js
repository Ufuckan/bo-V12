const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

exports.run = function(client, message, args) {
  
if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Bu Komutu Kullanmak İçin **Yönetici** Yetkisine Sahip Olmalısın!");

if (message.deletable) {
message.delete();
}  
  
if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
  
const embed1 = new Discord.MessageEmbed()
  
.setDescription("Lütfen silinecek mesaj miktarını yazınız..!")
.setColor('RED')

return message.channel.send(embed1).then(m => m.delete(5000));
  
}  

let deleteAmount;

if (parseInt(args[0]) > 100) { deleteAmount = 100; } else { deleteAmount = parseInt(args[0]); } 
  
message.channel.bulkDelete(deleteAmount, true)

.then(deleted => message.channel.send(`Hey, Başarıyla \`${deleted.size}\` Mesajı Ortalıktan Kaldırdım.`))

}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['sil','süpür'],
  permLevel: 3
};

exports.help = {
  name: 'temizle',
  description: 'Mesajları Siler.',
  usage: 'temizle'
};  