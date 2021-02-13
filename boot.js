const Discord = require("discord.js");
const fs = require("fs");
const Ayarlar = global.Ayarlar = require("./Ayarlar/Ayarlar.json");

console.log("Bot başlatılıyor...");
let _client = new Discord.Client();
if (Ayarlar.Özel_Sunucu === true) {
    _client = new Discord.Client({
        fetchAllMembers: true
    });
}
const client = global.client = _client;

const Commands = global.Commands = new Map();
console.log("--------------------------------");
console.log("Komutlar yükleniyor...");
fs.readdirSync("./Komutlar", { encoding: "utf-8" }).filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./Komutlar/${file}`);
    if (prop.conf.name == undefined || prop.run == undefined) return console.error(`[KOMUT] ${file} yüklenemedi.`);
    Commands.set(prop.conf.name, prop);
    if (prop.conf.aliases && prop.conf.aliases.length > 0) {
        prop.conf.aliases.forEach(aliase => Commands.set(aliase, prop));
    }
    if (prop.onLoad != undefined && typeof (prop.onLoad) == "function") prop.onLoad(client);
    console.log(`[KOMUT] ${file} için toplam ${prop.conf.aliases.length} destekçi yüklendi ve kendisi yüklendi.`);
});
console.log("--------------------------------");
console.log("Etkinlikler yükleniyor...");
fs.readdirSync("./Events", { encoding: "utf-8" }).filter(file => file.endsWith(".js")).forEach(file => {
    let prop = require(`./Events/${file}`);
    client.on(prop.conf.event, prop.execute);
    console.log(`[ETKINLIK] ${file} yüklendi.`);
});

console.log("--------------------------------");
console.log("| BOT HAZIRLANDI VE ANA DOSYA ÇALIŞTIRILIYOR |");

require("./savage.js");
