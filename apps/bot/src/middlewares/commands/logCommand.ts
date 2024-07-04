import { CommandContext, createMiddleware } from "seyfert";

export const logCommand = createMiddleware<void>(async ({ context, next }) => {
	const { client, author, command } = context;
	const { logger } = client;
	if (!command) return;
	logger.debug("Command used by", author.username, command);
	return next();
});
