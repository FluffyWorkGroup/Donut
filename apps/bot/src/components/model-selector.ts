import { MessageFlags } from "discord-api-types/v10";
import { ComponentCommand, type ComponentContext } from "seyfert";
import { EmbedColors } from "seyfert/lib/common";

export default class ModelSelector extends ComponentCommand {
	componentType = "Button" as const;

	filter(
		ctx: ComponentContext<typeof this.componentType>,
	): boolean | Promise<boolean> {
		return ctx.customId.startsWith("model");
	}

	async run(context: ComponentContext<typeof this.componentType>) {
		await context.write({
			embeds: [
				{
					description: "***Por implementar...***",
					color: EmbedColors.NotQuiteBlack,
				},
			],
			flags: MessageFlags.Ephemeral,
		});
	}
}
