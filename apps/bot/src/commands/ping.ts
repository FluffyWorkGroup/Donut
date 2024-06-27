import { Command, Declare } from "seyfert";
import type { CommandContext } from "seyfert";
import { EmbedColors } from "seyfert/lib/common";

@Declare({
	name: "ping",
	description: "Checks the latency of the bot.",
})
export default class Ping extends Command {
	async run(ctx: CommandContext) {
		const ping = ctx.client.gateway.latency;

		await ctx.write({
			embeds: [
				{
					title: "Pong!",
					description: `🏓 ${ping}ms`,
					color: EmbedColors.Blue,
				},
			],
		});
	}
}
