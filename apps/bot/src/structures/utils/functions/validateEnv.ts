import { Logger } from "seyfert";
import { InvalidEnviroment } from "../Errors";

const logger = new Logger({
	name: "[ENV]",
});

/**
 * Validate the environment variables.
 * @returns
 */

export function validateEnv(): void {
	logger.info("Validating environment variables...");

	if (!process.env.BOT_TOKEN)
		throw new InvalidEnviroment("BOT_TOKEN is required.");
}
