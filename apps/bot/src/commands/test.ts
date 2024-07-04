import { inspect } from "bun";
import {
	Command,
	Declare,
	Middlewares,
	Options,
	createStringOption,
	type CommandContext,
} from "seyfert";
const ai = await import("ai-wrapper/models");

const options = {
	content: createStringOption({
		description: "The content to send to the model",
		required: true,
	}),
};
@Declare({
	name: "test",
	description: "runs test command",
})
@Options(options)
@Middlewares(["checkDeveloperStatus"])
export default class Test extends Command {
	async run(ctx: CommandContext<typeof options>) {
		try {
			const response = await ai.models.blackbox.donut([
				{
					content: `The username for the user is ${ctx.author.username}`,
					id: "1",
					role: "system",
				},
				{
					content: ctx.options.content,
					id: "2",
					role: "user",
				},
			]);
			console.log(response);

			return ctx.write({
				content: inspect(response),
			});
		} catch (error) {
			console.error(error);
			return ctx.write({
				content: inspect(error),
			});
		}
	}
}
