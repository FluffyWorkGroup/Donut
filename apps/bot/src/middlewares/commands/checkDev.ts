import { MessageFlags } from "discord-api-types/v10";
import { createMiddleware, Embed } from "seyfert";
import { EmbedColors } from "seyfert/lib/common";

export const checkDeveloperStatus = createMiddleware(
	async ({ context, next }) => {
		const { author } = context;

		context.client.logger.debug("Checking developer status for", author.id);

		if (context.client.config.developers.includes(author.id))
			return next(context);

		const embed = new Embed()
			.setDescription("**You are not allowed to use this command.**")
			.setColor(EmbedColors.Red);

		await context.editOrReply({
			flags: MessageFlags.Ephemeral,
			embeds: [embed],
		});
	},
);
