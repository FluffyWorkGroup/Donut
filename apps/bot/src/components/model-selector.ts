import { findOrCreateUser, updateUser } from "db";
import { MessageFlags } from "discord-api-types/v10";
import { ComponentCommand, type ComponentContext } from "seyfert";
import { EmbedColors } from "seyfert/lib/common";

export default class ModelSelector extends ComponentCommand {
	componentType = "StringSelect" as const;

	filter(
		ctx: ComponentContext<typeof this.componentType>,
	): boolean | Promise<boolean> {
		return ctx.customId.startsWith("model");
	}

	async run(context: ComponentContext<typeof this.componentType>) {
		const user = await findOrCreateUser(
			context.interaction.user.id,
			context.interaction.user.username,
		);

		const model = context.interaction.data.values[0];

		if (model === user.model)
			return context.write({
				embeds: [
					{
						description: `***You already have the ${model} model selected.***`,
						color: EmbedColors.NotQuiteBlack,
					},
				],
				flags: MessageFlags.Ephemeral,
			});

		await updateUser(user.id, { model });

		if (context.client.usersDBCache.has(user.id)) {
			context.client.usersDBCache.delete(user.id);
			context.client.usersDBCache.set(user.id, model);
		}

		return context.write({
			embeds: [
				{
					description: `***You selected the ${model} model, now the bot will use this model for all future interactions.***`,
					color: EmbedColors.NotQuiteBlack,
				},
			],
			flags: MessageFlags.Ephemeral,
		});
	}
}
