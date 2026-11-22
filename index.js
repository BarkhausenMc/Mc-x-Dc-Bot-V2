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

bot.on("message", (message) => {
    const text = message.toString().trim()
    if (!text) return

    const withoutTags = text.replace(/(\[[^\]]*\]\s*)+/g, "")
    const separatorIndex = withoutTags.indexOf(": ")
    if (separatorIndex === -1) return

    const beforeName = withoutTags.slice(0, separatorIndex).trim()
    const chatMessage = withoutTags.slice(separatorIndex + 2).trim()
    if (!chatMessage) return

    const nameParts = beforeName.split(" ")
    const username = nameParts[nameParts.length - 1]
    if (!/^[A-Za-z0-9_]{1,16}$/.test(username)) return

    console.log(`[Chat] ${username}: ${chatMessage}`)
    discord.sendChat(username, chatMessage)
})

bot.on("login", () => {
    console.log("Minecraft-Bot eingeloggt.")
})
