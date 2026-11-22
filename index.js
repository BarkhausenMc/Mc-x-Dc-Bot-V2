require("dotenv").config()
const mineflayer = require("mineflayer")
const discord = require("./discord")

const bot = mineflayer.createBot({
  host: process.env.MC_HOST || 'hugosmp.net',
  port: parseInt(process.env.MC_PORT, 10) || 25565,
  username: process.env.MC_USERNAME || 'JSK1905',
  auth: process.env.MC_AUTH || 'microsoft',
  version: process.env.MC_VERSION || "1.21.11"
})

bot._client.on('add_resource_pack', (data) => {
    console.log(`Accept Server-Resource-Pack. url: ${data.url} , uuid: ${data.uuid}`);
    bot._client.write('resource_pack_receive', { uuid: data.uuid, result: 3 });
    bot._client.write('resource_pack_receive', { uuid: data.uuid, result: 0 });
});

bot.on("kicked", () =>{
    console.log("bot kicked!")
})

bot.on("error", (err) => {
    console.error("Minecraft-Fehler:", err.message)
})

bot.on("playerChat", (event) => {
    const username = event.senderName || "Unbekannt"
    const message = event.plainMessage || (event.contents && event.contents.toString()) || ""
    if (!message) return
    console.log(`[Chat] ${username}: ${message}`)
    discord.sendChat(username, message)
})

bot.on("message", (message, position) => {
    console.log(`[RAW-STRING] (${position}): ${message.toString()}`)
    console.log(`[RAW-JSON] (${position}): ${JSON.stringify(message)}`)
})

bot.on("messagestr", (message, position, sender) => {
    console.log(`[MESSAGESTR] (${position}): ${message}`)
    console.log(`[MESSAGESTR-SENDER] (${position}): ${sender ? sender.name || sender : "n/a"}`)
})

bot.on("login", () => {
    console.log("Minecraft-Bot eingeloggt.")
})
