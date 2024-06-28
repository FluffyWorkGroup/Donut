import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export * from "./queries";
export * from "./pipelines";
