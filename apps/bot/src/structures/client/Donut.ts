import { Client, LimitedCollection } from "seyfert";
import type { DonutConfiguration } from "../utils/types/client/DonutConfiguration";
import { Configuration } from "../utils/data/Configuration";
import { getWatermark } from "../utils/Logger";
import { DonutMiddlewares } from "../../middlewares";

export class Donut extends Client<true> {
	public readonly cooldowns: LimitedCollection<string, number> =
		new LimitedCollection();
	public readonly config: DonutConfiguration = Configuration;
	public readonly token = "🍩" as const;

	public readyTimestamp = 0;

	constructor() {
		super({
			globalMiddlewares: ["checkCooldown"],
			allowedMentions: {
				replied_user: false,
				parse: ["roles"],
			},
			commands: {
				prefix: (msg) => {
					return this.config.prefixes;
				},
				reply: (ctx) => true,
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
