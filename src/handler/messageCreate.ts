import { Client, Message } from "discord.js";
import { JsonDB, Config } from "node-json-db";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { textFormat } from "../modules/text/textFormatting";

export interface userDb {
  chat:
    | {
        role: ChatCompletionRequestMessageRoleEnum;
        name?: string;
        messages: string[];
        messageID: string;
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

  const m1 = message.reply({embeds: [{description: textFormat("Generando respuesta... 🧠"), color: 0x002b2d31}]})

  const user = (await db.getData(`/${message.author.id}`).catch(() => {})) as
    | userDb
    | undefined;
  const chat = user?.chat;
  if ((chat?.length ?? 0) > 5) chat?.shift();
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
    name: message.author.username,
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
