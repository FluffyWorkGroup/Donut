const ai = await import("ai-wrapper/models");
import { findOrCreateUser } from "db";
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
	name: "answer",
	description: "Answer a question",
	aliases: ["gpt", "chat", "cohere", "donut"],
})

@Options(options)
export default class Answer extends Command {
	async run(ctx: CommandContext<typeof options>) {
		const date = Date.now();
		const user = await findOrCreateUser(ctx.author.id, ctx.author.username);

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

		// @ts-ignore
		const response = await ai.models.openai.gpt.chat.normal[user.model]([
			{
				role: "user",
				content: ctx.options.prompt,
			},
		]);

		ctx.editOrReply({
			embeds: [
				{
					author: {
						name: user.model,
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
	}
}
