import { inspect } from "bun";
import {
	Command,
	type CommandContext,
	createStringOption,
	Declare,
	Embed,
	Options,
	Middlewares,
} from "seyfert";
import { EmbedColors } from "seyfert/lib/common";

const options = {
	code: createStringOption({
		description: "The code to evaluate",
		required: true,
	}),
};
@Declare({
	name: "eval",
	description: "Evaluate JavaScript code",
})

@Options(options)
@Middlewares(["checkDeveloperStatus"])
export default class Eval extends Command {
	async run(ctx: CommandContext<typeof options>) {
		try {
			const evl = globalThis;
			let result = evl.eval(ctx.options.code);
			let isPromise = false;

			result instanceof Promise ||
			(result instanceof Object && "then" in result)
				? // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
					(isPromise = true)
				: // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
					(isPromise = false);
			// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
			isPromise ? (result = await result) : result;

			ctx.write({
				embeds: [
					new Embed().setDescription(
						`\`\`\`js\n${inspect(result, { depth: 0 })}\`\`\``,
					),
				],
			});
		} catch (error) {
			return ctx.editOrReply({
				embeds: [
					new Embed()
						.setDescription(`\`\`\`diff\n- ${error}\`\`\``)
						.setColor(EmbedColors.DarkRed),
				],
			});
		}
	}
}
