import { logger } from "..";
import {
	createMessage,
	deleteMessage,
	findMessagesByUserID,
	findOrCreateChatByAuthorId,
} from "../queries";

/**
 * Injects a new message into the chat.
 * @param author - The author of the message.
 * @param message - The content and role of the message.
 * @returns A promise that resolves to the created message.
 */
export async function injectNewMessageInChat(
	author: {
		username: string;
		id: string;
	},
	message: {
		content: string;
		role: string;
	},
) {
	logger.debug(
		`Injecting new message from ${author.username} with ID ${author.id} into chat...`,
	);
	const chatsWithAuthor = await findOrCreateChatByAuthorId(author);
	const messages = await findMessagesByUserID(author.id);

	if (messages.length >= 50) {
		logger.debug(
			`Detected 50 messages from ${author.username} with ID ${author.id}, deleting the oldest message...`,
		);
		const oldestMessage = messages
			.filter((m) => m.role !== "system")
			.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
		if (oldestMessage) await deleteMessage(oldestMessage.id);
	}

	return await createMessage(
		{
			chatId:
				"chat" in chatsWithAuthor
					? chatsWithAuthor.chat.id
					: chatsWithAuthor.id,
			authorId: author.id,
		},
		message,
	);
}
