const ai = await import("ai-wrapper/models");
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
		ctx.deferReply(false);

		const models = Object.keys(ai.models.openai.gpt.chat.stream);

		const menu = new SelectMenu({
			options: models.map((model) => ({
				label: model,
				value: model,
			})),
			type: ComponentType.StringSelect,
		})
			.setCustomId("model")
			.setPlaceholder("Select a model")
			.toJSON();

		const ActionRow = {
			type: ComponentType.ActionRow,
			components: [menu],
		} as APIActionRowComponent<APISelectMenuComponent>;

		const response = await ai.models.openai.gpt.chat.normal["gpt-3.5-turbo"]([
			{
				role: "user",
				content: ctx.options.prompt,
			},
		]);

		ctx.editOrReply({
			embeds: [
				{
					author: {
						name: "GPT-3.5 Turbo",
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
