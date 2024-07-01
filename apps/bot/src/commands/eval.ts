import { inspect } from "bun";
import {
	Command,
	CommandContext,
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
			let result = eval(ctx.options.code);
			let isPromise = false;

			result instanceof Promise ||
			(result instanceof Object && "then" in result)
				? (isPromise = true)
				: (isPromise = false);
			isPromise ? (result = await result) : (result = result);

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
