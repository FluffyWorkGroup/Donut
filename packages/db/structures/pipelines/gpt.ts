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
			chatId: chatsWithAuthor.id,
		},
		{
			content: message.content,
			role: message.role,
		},
	);
}
