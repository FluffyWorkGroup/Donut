import { logger } from "..";
import {
	createMessage,
	deleteMessage,
	findMessagesByUserID,
	findOrCreateChatByAuthorId,
	findOrCreateUser,
} from "../queries";

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

	if (messages.length >= 10) {
		logger.debug(
			`Detected 10 messages from ${author.username} with ID ${author.id}, deleting the oldest message...`,
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
