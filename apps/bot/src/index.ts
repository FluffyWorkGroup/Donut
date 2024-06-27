import { Logger } from "seyfert";
import { Donut } from "./structures/client/Donut";
import { customLogger } from "./structures/utils/Logger";
import { validateEnv } from "./structures/utils/functions/validateEnv";

Logger.customize(customLogger);
Logger.saveOnFile = "all";
Logger.dirname = "logs";

validateEnv();

const client = new Donut();

export default client;
