import { Client, Message } from "discord.js";
import { JsonDB, Config } from "node-json-db";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { textFormat, usernameFormat } from "../modules/text/textFormatting";

// This code is used to store the user's chat history, prompts, and preferences in the database. The user's chat history is stored in the chat field, which is an array of objects. Each object contains the role of the user who sent the message, the name of the user who sent the message, the message itself, and the ID of the message. The prompts field is an array of objects, where each object contains the message and ID of the prompt. The userPreferences field is an object with the mode, model, and customRules fields. The mode field is either "chat" or "model", depending on whether the user is in chat mode or model mode. The model field contains the ID of the model that the user has selected. The customRules field contains the custom rules that the user has selected. The custom rules are an object with the temperature, top_p, frequency_penalty, presence_penalty, and maxTokens fields. These fields are all numbers, and they represent the custom rules that the user has selected. The user's chat history, prompts, and preferences are stored in the database.

export interface userDb {
  chat:
    | {
        role: ChatCompletionRequestMessageRoleEnum;
        name?: string;
        messages: string[];
        messageID: string;
        timestamp?: number;
      }[]
    | []
    | undefined;
  prompts:
    | {
        message: string;
        messageID: string;
      }[]
    | []
    | undefined;
  userPreferences: {
    mode: "chat" | "model";
    model: string | null;
    customRules: {
      temperature?: number;
      top_p?: number;
      frequency_penalty?: number;
      presence_penalty?: number;
      maxTokens?: number;
    } | null;
  };
}

const db = new JsonDB(new Config("src/db/users", true, false, "/"));

const run = async (client: Client, message: Message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("test")) return;
  if (!message.guild) return;
  const date = Date.now();

  const m1 = message.reply({
    embeds: [
      {
        description: textFormat("Generando respuesta... 🧠"),
        color: 0x002b2d31,
      },
    ],
  });

  const user = (await db.getData(`/${message.author.id}`).catch(() => {})) as
    | userDb
    | undefined;
  const chat = user?.chat;

  if ((chat?.length ?? 0) > 5) {
    // delete the last messages that are not the last 5
    const chatt = chat?.slice(chat.length - 5)
    db.push(`/${message.author.id}/chat`, chatt);
  }

  if (!user)
    db.push(`/${message.author.id}`, {
      chat: [],
      prompts: [],
      userPreferences: { mode: "chat", model: null, customRules: null },
    });

  db.push(`/${message.author.id}/chat[]`, {
    role: "user",
    messages: [message.content.split(" ").slice(1).join(" ")],
    messageID: message.id,
    name: usernameFormat(message.author.username),
    timestamp: date,
  });

  if (message.content.startsWith("test"))
    client.emit("promptProcess", {
      message: message,
      date: date,
      db: db,
      chat: chat,
      messageToReply: await m1,
    });
};

export default run;
