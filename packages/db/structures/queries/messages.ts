import type { Message } from "@prisma/client";
import { findUserByChatID, getChat, logger, prisma } from "..";
import type { GetBatchResult } from "@prisma/client/runtime/library";

/**
 * Retrieves all messages from the database
 * @returns {Promise<Message[]>} A promise that resolves to an array of Message objects
 */

export async function getMessages(): Promise<Message[]> {
	logger.debug("Retrieving all messages from the database...");
	return await prisma.message.findMany();
}

/**
 * Retrieves a message by its ID
 * @param id - The ID of the message to retrieve
 * @returns A promise that resolves to the message object if found, or null if not found
 */
export async function getMessage(id: string): Promise<Message | null> {
	logger.debug(`Retrieving message with ID ${id} from the database...`);
	return await prisma.message.findUnique({ where: { id } });
}

/**
 * Creates a new message and saves it to the database.
 *
 * @param context - The context object containing information about the chat and author.
 * @param message - The message object containing the content and role of the message.
 * @returns A Promise that resolves to the created message.
 */
export async function createMessage(
	context: { chatId: string; authorId: string },
	message: { content: string; role: string },
): Promise<Message> {
	const chat = await getChat(context.chatId);
	const author = await findUserByChatID(chat?.id ?? "");

	logger.debug(`Creating a new message for chat ${chat?.id}...`);

	return await prisma.message.create({
		data: {
			content: message.content,
			role: message.role,
			chat: {
				connect: {
					id: chat?.id,
				},
			},
			author: {
				connect: {
					id: author?.id,
				},
			},
		},
	});
}
/**
 * Updates a message in the database
 * @param id - The ID of the message to update
 * @param data - The data to update the message with
 * @returns A promise that resolves to the updated message
 */

export async function updateMessage(
	id: string,
	data: Partial<Message>,
): Promise<Message> {
	logger.debug(`Updating message with ID ${id}...`);
	return await prisma.message.update({ where: { id }, data });
}

/**
 * Deletes a message from the database
 * @param id - The ID of the message to delete
 * @returns A promise that resolves to the deleted message
 */
export async function deleteMessage(id: string): Promise<Message> {
	logger.debug(`Deleting message with ID ${id}...`);
	return await prisma.message.delete({ where: { id } });
}

/**
 * Deletes all messages from the database
 * @returns A promise that resolves to the number of messages deleted
 */
export async function deleteAllMessages(): Promise<GetBatchResult> {
	logger.debug("Deleting all messages from the database...");
	return await prisma.message.deleteMany();
}

/**
 * Counts the number of messages in the database
 * @returns The total number of messages
 */

export async function countMessages(): Promise<number> {
	logger.debug("Counting the number of messages in the database...");
	return await prisma.message.count();
}

/**
 * Finds a message by its ID
 * @param id - The ID of the message
 * @returns A promise that resolves to the found message, or null if no message is found
 */
export async function findMessageByID(id: string): Promise<Message | null> {
	logger.debug(`Finding message with ID ${id}...`);
	return await prisma.message.findUnique({ where: { id } });
}

/**
 * Finds all messages by a user's ID
 * @param id - The ID of the user
 * @returns A promise that resolves to an array of messages found
 */
export async function findMessagesByUserID(id: string): Promise<Message[]> {
	logger.debug(`Finding messages by user ID ${id}...`);
	return await prisma.message.findMany({ where: { authorId: id } });
}

/**
 * Deletes all messages by a user's ID
 * @param id - The ID of the user
 * @returns A promise that resolves to the number of messages deleted
 */

export async function deleteMessagesByUserID(
	id: string,
): Promise<GetBatchResult> {
	logger.debug(`Deleting messages by user ID ${id}...`);
	return await prisma.message.deleteMany({ where: { authorId: id } });
}

/**
 * Delete multiple messages by a filter
 * @param filter - The filter to apply to the messages
 * @returns A promise that resolves to the number of messages deleted
 */

export async function deleteMessagesByFilter(filter: {
	authorId?: string;
	chatId?: string;
	content?: string;
	role?: string;
}): Promise<GetBatchResult> {
	logger.debug(`Deleting messages by filters ${JSON.stringify(filter)}...`);
	return await prisma.message.deleteMany({ where: filter });
}
