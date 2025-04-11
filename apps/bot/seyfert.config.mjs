import { config } from "seyfert";

export default config.bot({
    token: process.env.BOT_TOKEN,
    locations: {
        "base": "dist",
        "commands": "commands",
        "events": "events",
    },
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "GUILD_MESSAGE_CONTENT",
    ],
});
