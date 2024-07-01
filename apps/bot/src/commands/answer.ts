const ai = await import("ai-wrapper/models");
import {
	findMessagesByUserID,
	findOrCreateUser,
	injectNewMessageInChat,
} from "db";
import {
	ComponentType,
	type APIActionRowComponent,
	type APISelectMenuComponent,
} from "discord-api-types/v10";
import {
	Command,
	type CommandContext,
	Declare,
	SelectMenu,
	Options,
	createStringOption,
	createBooleanOption,
} from "seyfert";
import { EmbedColors } from "seyfert/lib/common";

const options = {
	prompt: createStringOption({
		description: "The prompt to use",
		required: true,
		max_length: 600,
		min_length: 3,
	}),
	debug: createBooleanOption({
		description: "Enable debug mode",
	}),
};

@Declare({
	name: "answer",
	description: "Answer a question",
	aliases: ["gpt", "chat", "cohere", "donut"],
	contexts: ["Guild", "BotDM", "PrivateChannel"],
	integrationTypes: ["UserInstall", "GuildInstall"],
})

@Options(options)
export default class Answer extends Command {
	async run(ctx: CommandContext<typeof options>) {
		try {
			const date = Date.now();
			const model =
				ctx.client.usersDBCache.get(ctx.author.id) ??
				(await findOrCreateUser(ctx.author.id, ctx.author.username)).model;

			const message = await injectNewMessageInChat(
				{
					username: ctx.author.username,
					id: ctx.author.id,
				},
				{
					content: ctx.options.prompt,
					role: "user",
				},
			);

			ctx.deferReply(false);

			const models = Object.keys(ai.models.openai.gpt.chat.stream);

			const menu = new SelectMenu({
				options: models.map((model) => ({
					label: model,
					value: model,
				})),
				type: ComponentType.StringSelect,
			})
				.setCustomId(`model:${ctx.author.id}`)
				.setPlaceholder("Select a model")
				.toJSON();

			const ActionRow = {
				type: ComponentType.ActionRow,
				components: [menu],
			} as APIActionRowComponent<APISelectMenuComponent>;

			const response = await ai.models.openai.gpt.chat.normal[
				model as keyof typeof ai.models.openai.gpt.chat.normal
			](
				[
					...((await findMessagesByUserID(ctx.author.id))
						.filter((m) => m.chatId === message.chatId)
						.map((user) => {
							return {
								content: user.content,
								role: user.role as "user" | "assistant",
							};
						}) ?? []),
				],
				{
					max_tokens: 600,
				},
			);

			const messageBot = await injectNewMessageInChat(
				{
					username: "Donut",
					id: ctx.author.id,
				},
				{
					content: response.choices[0].message.content ?? "No response",
					role: "assistant",
				},
			);

			ctx.editOrReply({
				content: ctx.options.debug?.valueOf()
					? `DEBUG INFO: Took ${Date.now() - date}ms\nCHAT ID: ${message.chatId}\nMESSAGES INYECTED: [USER] ${message.id} [BOT] ${messageBot.id}\nREQUEST: ${JSON.stringify(response.system_fingerprint)} ${JSON.stringify(response.usage)}`
					: "",
				embeds: [
					{
						author: {
							name: model,
						},
						description: response.choices[0].message.content ?? "No response",
						footer: {
							text: `Took ${Date.now() - date}ms`,
						},
						color: EmbedColors.Blue,
					},
				],
				components: [ActionRow],
			});
		} catch (error) {
			ctx.editOrReply({
				content: "An error occurred, please try again later",
			});
		}
	}
}
