import { DEBUG } from "@donut/common";
import { ask } from "ai-wrapper";
import {
	findMessagesByUserID,
	findOrCreateUser,
	injectNewMessageInChat,
} from "db";
import {
	ButtonStyle,
	ComponentType,
	type APIActionRowComponent,
	type APIButtonComponent,
} from "discord-api-types/v10";
import {
	Command,
	type CommandContext,
	Declare,
	Options,
	createStringOption,
	Button,
} from "seyfert";
import { EmbedColors } from "seyfert/lib/common";

const options = {
	prompt: createStringOption({
		description: "The prompt to use",
		required: true,
		max_length: 600,
		min_length: 3,
	}),
};

@Declare({
	name: "ask",
	description: "Answer a question",
	aliases: ["gpt", "chat", "cohere", "donut"],
	contexts: ["Guild", "BotDM", "PrivateChannel"],
	integrationTypes: ["UserInstall", "GuildInstall"],
})

@Options(options)
export default class Answer extends Command {
	async run(ctx: CommandContext<typeof options>) {
		try {
			await ctx.deferReply(false);
			const date = Date.now();
			const user = await findOrCreateUser(ctx.author.id, ctx.author.username);

			const message = await injectNewMessageInChat(user, {
				content: ctx.options.prompt,
				role: "user",
			});

			const response = await ask(user.model as "donutdBdXXgi", [
				...(await findMessagesByUserID(ctx.author.id))
					.filter((m) => m.chatId === message.chatId)
					.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
					.map((user) => {
						return {
							content: user.content,
							role: user.role as "user" | "assistant",
							id: user.chatId,
						};
					}),
			]);

			const messageBot = await injectNewMessageInChat(user, {
				content:
					typeof response === "string"
						? response ?? "No response"
						: response.choices[0].message.content ?? "No response",
				role: "assistant",
			});

			const debugInfo = `DEBUG INFO: Took ${Date.now() - date}ms\nCHAT ID: ${message.chatId}\nMESSAGES INYECTED: [USER] ${message.id} [BOT] ${messageBot.id}\n${typeof response === "string" ? "REQUEST: No request" : `REQUEST: ${JSON.stringify(response.system_fingerprint)} ${JSON.stringify(response.usage)}`}`;
			const buttons = new Button()
				.setEmoji("🤖")
				.setStyle(ButtonStyle.Secondary)
				.setCustomId(`model:${ctx.author.id}`)
				.toJSON();

			const ActionRow = {
				type: ComponentType.ActionRow,
				components: [buttons],
			} as APIActionRowComponent<APIButtonComponent>;

			ctx.editOrReply({
				content: DEBUG ? debugInfo : "",
				embeds: [
					{
						author: {
							name: `Model: ${user.model}`,
						},
						description:
							typeof response === "string"
								? response ?? "No response"
								: response.choices[0].message.content ?? "No response",
						footer: {
							text: `Took ${((Date.now() - date) / 1000).toFixed(1)}s`,
						},
						color: EmbedColors.Blue,
					},
				],
				components: [ActionRow],
			});
		} catch (error) {
			console.log(error);
			ctx.editOrReply({
				embeds: [
					{
						description: "An error occurred, please try again later",
						color: EmbedColors.Red,
					},
				],
			});
		}
	}
}
