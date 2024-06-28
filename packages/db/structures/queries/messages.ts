/**
 * Retrieves all messages from the database
 * @returns {Promise<Message[]>} A promise that resolves to an array of Message objects
 */

import type { Chat, Message, User } from "@prisma/client";
import {
	findOrCreateChatByAuthorId,
	findUserByChatID,
	getChat,
	prisma,
} from "..";
import type { GetBatchResult } from "@prisma/client/runtime/library";

export async function getMessages(): Promise<Message[]> {
	return await prisma.message.findMany();
}

/**
 * Retrieves a message by its ID
 * @param id - The ID of the message to retrieve
 * @returns A promise that resolves to the message object if found, or null if not found
 */
export async function getMessage(id: string): Promise<Message | null> {
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
	context: {
		chatId: string;
		authorId?: string;
		author?: User;
		chat?: Chat;
	},
	message: {
		content: string;
		role?: string;
	},
): Promise<Message> {
	const authorData: User | null | undefined =
		context.author ?? (await findUserByChatID(context.chatId));
	const chatData: Chat | null | undefined =
		context.chat ??
		(await findOrCreateChatByAuthorId({
			id: context.author?.id ?? "",
			username: context.author?.username ?? "",
		}));
	const roleData = message.role ?? "USER";

	return await prisma.message.create({
		data: {
			chat: {
				connect: {
					id: chatData?.id,
				},
			},
			author: {
				connect: {
					id: authorData?.id,
				},
			},
			content: message.content,
			role: roleData,
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
	return await prisma.message.update({ where: { id }, data });
}

/**
 * Deletes a message from the database
 * @param id - The ID of the message to delete
 * @returns A promise that resolves to the deleted message
 */
export async function deleteMessage(id: string): Promise<Message> {
	return await prisma.message.delete({ where: { id } });
}

/**
 * Deletes all messages from the database
 * @returns A promise that resolves to the number of messages deleted
 */
export async function deleteAllMessages(): Promise<GetBatchResult> {
	return await prisma.message.deleteMany();
}

/**
 * Counts the number of messages in the database
 * @returns The total number of messages
 */

export async function countMessages(): Promise<number> {
	return await prisma.message.count();
}

/**
 * Finds a message by its ID
 * @param id - The ID of the message
 * @returns A promise that resolves to the found message, or null if no message is found
 */
export async function findMessageByID(id: string): Promise<Message | null> {
	return await prisma.message.findUnique({ where: { id } });
}

/**
 * Finds all messages by a user's ID
 * @param id - The ID of the user
 * @returns A promise that resolves to an array of messages found
 */
export async function findMessagesByUserID(id: string): Promise<Message[]> {
	return await prisma.message.findMany({ where: { authorId: id } });
}
