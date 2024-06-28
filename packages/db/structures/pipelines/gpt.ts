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
