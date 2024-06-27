import { MessageFlags } from "discord-api-types/v10";
import {
	ComponentCommand,
	type ComponentContext,
	type ContextComponentCommandInteractionMap,
} from "seyfert";

export default class ModelSelector extends ComponentCommand {
	componentType = "StringSelect" as const;

	filter(
		ctx: ComponentContext<keyof ContextComponentCommandInteractionMap, never>,
	): boolean | Promise<boolean> {
		return ctx.customId === "model";
	}

	async run(
		context: ComponentContext<
			keyof ContextComponentCommandInteractionMap,
			never
		>,
	) {
		return context.write({
			content: "You selected a model!",
			flags: MessageFlags.Ephemeral,
		});
	}
}
