export interface DonutConfiguration {
	/**
	 * The default prefix for the bot.
	 * @default "donut"
	 */

	prefix: string;

	/**
	 * The default token response for the bot, for chatgpt.
	 * @default 256
	 */

	tokenLength: number;

	/**
	 * Default provider for the AI responses.
	 * @default "chatgpt"
	 */

	provider: "chatgpt" | "openai" | "gpt-3.5-turbo" | "davinci";

	/**
	 * The default prefixes for the bot.
	 * @default ["donut", "d"]
	 */
	prefixes: string[];

	/**
	 * The developers of the bot.
	 * @default ["852588734104469535", "390156982730096640"]
	 **/

	developers: string[];
}
