import type { Chat, Message, User } from "@prisma/client";
import { findOrCreateUser, prisma } from "..";
import { BOT_ID, DEFAULT_MODEL, systemPrompt } from "@donut/common";

/**
 * Retrieves all chats from the database.
 * @returns {Promise<Chat[]>} A promise that resolves to an array of Chat objects.
 */

export async function getChats(): Promise<Chat[]> {
	return await prisma.chat.findMany();
}

/**
 * Retrieves a chat by its ID.
 * @param id - The ID of the chat to retrieve.
 * @returns A Promise that resolves to the chat object if found, or null if not found.
 */
export async function getChat(id: string): Promise<Chat | null> {
	return await prisma.chat.findUnique({ where: { id } });
}

/**
 * Creates a new chat in the database.
 * @param id - The ID of the chat.
 * @param name - The name of the chat.
 * @returns {Promise<Chat>} A promise that resolves to the created chat.
 */

export async function createChat(
	authorInfo: { id: string; username: string },
	author?: User,
): Promise<{
	chat: Chat;
	systemMessage: Message;
}> {
	let authorData: User | null | undefined = author;
	if (!authorData) {
		authorData = await findOrCreateUser(authorInfo.id, authorInfo.username);
	}

	const chat = await prisma.chat.create({
		data: {
			author: {
				connect: {
					id: authorData.id,
				},
			},
		},
	});

	// push the system prompt to the chat
	const systemMessage = await prisma.message.create({
		data: {
			content: systemPrompt,
			role: "SYSTEM",
			chat: {
				connect: {
					id: chat.id,
				},
			},
			author: {
				connect: {
					id: authorData.id,
				},
			},
		},
	});

	return {
		chat,
		systemMessage,
	};
}

/**
 * Updates a chat in the database.
 * @param id - The ID of the chat to update.
 * @param data - The data to update the chat with.
 * @returns A promise that resolves to the updated chat.
 */
export async function updateChat(
	id: string,
	data: Partial<Chat>,
): Promise<Chat> {
	return await prisma.chat.update({ where: { id }, data });
}

/**
 * Deletes a chat from the database.
 * @param id - The ID of the chat to delete.
 * @returns A promise that resolves to the deleted chat.
 */
export async function deleteChat(id: string): Promise<Chat> {
	return await prisma.chat.delete({ where: { id } });
}

/**
 * Get a chat by the author's ID.
 * @param authorId - The ID of the author.
 * @returns A promise that resolves to the chat object if found, or null if not found.
 */

export async function getChatByAuthorId(
	authorId: string,
): Promise<Chat | null> {
	return await prisma.chat.findFirst({
		where: { authorId },
	});
}

/**
 * Get a chat by the author's username.
 * @param authorUsername - The username of the author.
 * @returns A promise that resolves to the chat object if found, or null if not found.
 */

export async function getChatByAuthorUsername(
	authorUsername: string,
): Promise<Chat | null> {
	return await prisma.chat.findFirst({
		where: { author: { username: authorUsername } },
	});
}

/**
 * Find or create a chat by the author's ID.
 * @param authorId - The ID of the author.
 * @returns A promise that resolves to the chat object.
 */

export async function findOrCreateChatByAuthorId(authorInfo: {
	username: string;
	id: string;
}): Promise<
	| {
			chat: Chat;
			systemMessage: Message;
	  }
	| Chat
> {
	const chat = await getChatByAuthorId(authorInfo.id);
	if (chat) return chat;
	return await createChat({ id: authorInfo.id, username: authorInfo.username });
}
