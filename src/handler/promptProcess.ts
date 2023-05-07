import { Client, Message } from "discord.js";
import {
  chatCompletionRules,
  chatContext,
} from "../modules/models/modelsRules";
import { gptModels } from "../modules/models/gpt";
import { textFormat } from "../modules/text/textFormatting";
import { JsonDB } from "node-json-db";
import { userDb } from "./messageCreate";

const run = async (
  client: Client,
  data: { message: Message; date: number, db: JsonDB, chat: userDb["chat"], messageToReply: Message }
) => {
  try {
  const response = await new gptModels(
    "text-davinci-003",
    "chat",
    chatCompletionRules,
    chatContext(data.message),
    data.chat?.map(x => {return {role: x.role, content: x.messages[0], name: x.name}}).slice(1)
  ).getAnswer(data.message.content.split(" ").slice(1).join(" "));

  if (!response) return data.messageToReply.edit({embeds: [{description: "Ocurrió un error al generar la respuesta.", color: 0x002b2d31}]});
  data.db.push(`/${data.message.author.id}/chat[]`, {
    role: "assistant",
    messages: response.responses,
    messageID: data.message.id,
    timestamp: Date.now(),
  });

  const embed = {
    description: textFormat(response?.responses[0] as string),
    color: 0x002b2d31,
    footer: {
      text: `Tomó ${
        ((Date.now() - data.date) / 1000).toFixed(2)
      } segundos | Conversación con el id: ${data.message.author.id} | Respuesta generada por el modelo: ${response?.apiResponse.data.model}`,
    },
  };

  data.messageToReply.edit({ embeds: [embed] });
} catch (e) {
  data.messageToReply.edit({ embeds: [{description: "Ocurrió un error al generar la respuesta", color: 0x002b2d31}] })
  }

  
};

export default run;
