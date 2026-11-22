require("dotenv").config()
const { Client, GatewayIntentBits, MessageFlags, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder } = require("discord.js")

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
})

let channel = null

client.once("ready", async () => {
    try {
        channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID)
        console.log(`Discord verbunden als ${client.user.tag}`)
        console.log(`Ziel-Channel: ${channel.name} (${channel.id})`)
    } catch (err) {
        console.error("Fehler beim Abrufen des Discord-Channels:", err.message)
    }
})

async function sendChat(username, message) {
    if (!channel) return
    const container = new ContainerBuilder()
    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent("**Minecraft Chat**")
    )
    container.addSeparatorComponents(new SeparatorBuilder())
    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`**[${username}]:** ${message}`)
    )
    try {
        await channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [container]
        })
    } catch (err) {
        console.error("Fehler beim Senden an Discord:", err.message)
    }
}

client.login(process.env.DISCORD_TOKEN).catch((err) => {
    console.error("Fehler beim Discord-Login:", err.message)
    process.exit(1)
})

module.exports = { client, sendChat }
