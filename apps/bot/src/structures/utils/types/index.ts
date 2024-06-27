import type {
	CommandContext,
	ComponentContext,
	MenuCommandContext,
	MessageCommandInteraction,
	ModalContext,
	UserCommandInteraction,
} from "seyfert";

export type AnyContext =
	| CommandContext
	| MenuCommandContext<MessageCommandInteraction | UserCommandInteraction>
	| ComponentContext
	| ModalContext;

export interface Options {
	/** Command cooldown */
	cooldown?: number;
	/** If only the  bot owner can use the command */
	ownerOnly?: boolean;
	/** If only the bot developer can use the command */
	developerOnly?: boolean;
}
