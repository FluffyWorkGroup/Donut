import { logger } from "..";
import {
	createMessage,
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
