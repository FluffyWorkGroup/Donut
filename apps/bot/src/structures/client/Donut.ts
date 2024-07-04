import { Client, LimitedCollection } from "seyfert";
import type { DonutConfiguration } from "../utils/types/client/DonutConfiguration";
import { Configuration } from "../utils/data/Configuration";
import { getWatermark } from "../utils/Logger";
import { DonutMiddlewares } from "../../middlewares";

export class Donut extends Client<true> {
	public readonly cooldowns: LimitedCollection<string, number> =
		new LimitedCollection();
	public readonly usersDBCache: LimitedCollection<string, string> =
		new LimitedCollection({ limit: 20 });
	public readonly config: DonutConfiguration = Configuration;
	public readonly token = "🍩" as const;

	public readyTimestamp = 0;

	constructor() {
		super({
			globalMiddlewares: ["checkCooldown", "logCommand"],
			allowedMentions: {
				replied_user: false,
				parse: ["roles"],
			},
			commands: {
				prefix: () => {
					return this.config.prefixes;
				},
				reply: () => true,
			},
		});

		this.run();
	}

	private async run(): Promise<typeof this.token> {
		getWatermark();

		this.setServices({
			middlewares: DonutMiddlewares,
		});

		await this.start();
		await this.uploadCommands();

		return "🍩";
	}
}
