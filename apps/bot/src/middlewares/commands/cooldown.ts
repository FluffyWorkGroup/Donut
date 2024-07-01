import { createMiddleware } from "seyfert";
import type { AnyContext } from "../../structures/utils/types";
import { MessageFlags } from "seyfert/lib/types";
import { EmbedColors } from "seyfert/lib/common";

type CommandData = {
	name: string;
	type: string;
};

function getMetadata(ctx: AnyContext): CommandData {
	if (ctx.isChat() || ctx.isMenu())
		return {
			name: ctx.fullCommandName,
			type: "command",
		};

	if (ctx.isComponent())
		return {
			name: ctx.customId,
			type: "component",
		};

	return {
		name: "---",
		type: "any",
	};
}

export const checkCooldown = createMiddleware<void>(
	async ({ context, next }) => {
		const { client, author, command } = context;
		const { cooldowns } = client;

		if (!command) return;

		const { name, type } = getMetadata(context);

		context.client.logger.debug("Checking cooldown for", name, type);

		const cooldown = (command.cooldown ?? 3) * 1000;
		const timeNow = Date.now();
		const setKey = `${name}-${type}-${author.id}`;

		const data = cooldowns.get(setKey);
		if (data && timeNow < data)
			return context.editOrReply({
				flags: MessageFlags.Ephemeral,
				embeds: [
					{
						description:
							"***You are on cooldown for this command. Please wait a moment before using it again.***",
						color: EmbedColors.Red,
					},
				],
			});

		cooldowns.set(setKey, timeNow + cooldown);

		return next();
	},
);
