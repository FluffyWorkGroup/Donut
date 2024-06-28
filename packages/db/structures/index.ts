import { Logger } from "@donut/common/structures/utils/Logger";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export const logger = new Logger();

export * from "./queries";
export * from "./pipelines";
