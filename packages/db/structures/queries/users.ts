import { DEFAULT_MODEL } from "@donut/common";
import { prisma } from "..";
import type { User } from "@prisma/client";
import type { GetBatchResult } from "@prisma/client/runtime/library";

/**
 * Retrieves all users from the database.
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 */
export async function getUsers(): Promise<User[]> {
	return await prisma.user.findMany();
}

/**
 * Retrieves a user by their ID.
 * @param id - The ID of the user to retrieve.
 * @returns A Promise that resolves to the user object if found, or null if not found.
 */
export async function getUser(id: string): Promise<User | null> {
	return await prisma.user.findUnique({ where: { id } });
}

/**
 * Creates a new user in the database.
 * @param id - The ID of the user.
 * @param username - The username of the user.
 * @param model - The model of the user (optional, defaults to DEFAULT_MODEL).
 * @returns {Promise<User>} A promise that resolves to the created user.
 */
export async function createUser(
	id: string,
	username: string,
	model = DEFAULT_MODEL,
): Promise<User> {
	return await prisma.user.create({
		data: {
			id: id,
			username: username,
			model: model,
		},
	});
}

/**
 * Updates a user in the database.
 * @param id - The ID of the user to update.
 * @param data - The data to update the user with.
 * @returns A promise that resolves to the updated user.
 */
export async function updateUser(
	id: string,
	data: { username?: string },
): Promise<User> {
	return await prisma.user.update({ where: { id }, data });
}

/**
 * Deletes a user from the database.
 * @param id - The ID of the user to delete.
 * @returns A promise that resolves to the deleted user.
 */
export async function deleteUser(id: string): Promise<User> {
	return await prisma.user.delete({ where: { id } });
}

/**
 * Deletes all users from the database.
 * @returns {Promise<GetBatchResult>} A promise that resolves to the result of the deletion operation.
 */
export async function deleteAllUsers(): Promise<GetBatchResult> {
	return await prisma.user.deleteMany();
}

/**
 * Counts the number of users in the database.
 * @returns {Promise<number>} The total number of users.
 */
export async function countUsers(): Promise<number> {
	return await prisma.user.count();
}

/**
 * Finds a user by their ID.
 * @param id - The ID of the user.
 * @returns A promise that resolves to the found user, or null if no user is found.
 */
export async function findUserByID(id: string): Promise<User | null> {
	return await prisma.user.findUnique({ where: { id } });
}

/**
 * Finds a user their ID, or creates a new user if no user is found.
 * @param id - The ID of the user.
 * @param username - The username of the user.
 * @param model - The model of the user (optional, defaults to DEFAULT_MODEL).
 * @returns A promise that resolves to the found or created user.
 */

export async function findOrCreateUser(
	id: string,
	username: string,
	model = DEFAULT_MODEL,
): Promise<User> {
	const user = await findUserByID(id);
	if (user) return user;

	return await createUser(id, username, model);
}

/**
 * Finds an user by their chat ID.
 * @param chatId - The ID of the chat.
 * @returns A promise that resolves to the found user, or null if no user is found.
 */
export async function findUserByChatID(chatId: string): Promise<User | null> {
	return await prisma.user.findFirst({
		where: {
			chats: {
				some: { id: chatId },
			},
		},
	});
}
