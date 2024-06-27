// @ts-check
const { DEBUG } = require("./src/structures/utils/data/Constants");

const { GatewayIntentBits } = require("discord-api-types/v10");
const { config } = require("seyfert");

module.exports = config.bot({
	token: process.env.BOT_TOKEN ?? "",
	debug: DEBUG,
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
	],
	locations: {
		base: "src",
		output: "src",
		commands: "commands",
		components: "components",
		events: "events"
	},
});
