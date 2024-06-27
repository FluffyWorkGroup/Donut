import type { ParseClient, ParseMiddlewares } from "seyfert";
import type { Donut } from "./structures/client/Donut";
import type { DonutMiddlewares } from "./middlewares";
import type { Options } from "./structures/utils/types";

declare module "seyfert" {
	interface InternalOptions {
		withprefix: true;
	}

	interface Command extends Options {}
	interface SubCommand extends Options {}
	interface ComponentCommand extends Options {}
	interface ModalCommand extends Options {}
	interface ContextMenuCommand extends Options {}

	interface UsingClient extends ParseClient<Donut> {}
	interface RegisteredMiddlewares
		extends ParseMiddlewares<typeof DonutMiddlewares> {}
	interface GlobalMetadata extends ParseMiddlewares<typeof DonutMiddlewares> {}
}
