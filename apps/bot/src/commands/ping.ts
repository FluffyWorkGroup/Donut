import { Command, CommandContext, Declare, Embed } from "seyfert";

@Declare({
    name: "ping",
    description: "Ping the bot",
    aliases: ["p"],
})
export class PingCommand extends Command {
    async run(ctx: CommandContext) {
        const ping = ctx.client.gateway.latency;
        const embed = new Embed()
            .setTitle("Ping")
            .setDescription(`Pong! ${ping}ms`);
        ctx.write({ embeds: [embed] });
    }
}
