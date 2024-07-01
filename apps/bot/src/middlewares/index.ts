import { checkDeveloperStatus } from "./commands/checkDev";
import { checkCooldown } from "./commands/cooldown";
import { logCommand } from "./commands/logCommand";

export const DonutMiddlewares = {
	checkCooldown,
	checkDeveloperStatus,
	logCommand,
};
