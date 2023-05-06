import { Configuration, OpenAIApi } from "openai";
import { apikey } from "../../config.json";
import { textFormat } from "../text/textFormatting";

type gptModel =
  | "text-davinci-003"
  | "text-davinci-003"
  | "text-davinci-002"
  | "text-curie-001"
  | "text-babbage-001"
  | "text-ada-001"
  | "davinci-instruct-beta"
  | "davinci"
  | "curie-instruct-beta"
  | "curie"
  | "babbage"
  | "ada";

type codexModel =
  | "code-davinci-002"
  | "code-davinci-001"
  | "code-cushman-002"
  | "code-cushman-001";

export class gptModels {
  model: gptModel | codexModel;
  mode: "chat" | "answer";
  cachedChatMessages: any[];
  customSettings?: {
    temperature?: number;
    top_p?: number;
    frecuency_penalty?: number;
    presence_penalty?: number;
  };
  rules?: string;
  maxTokens?: number;

  constructor(
    model: gptModel | codexModel,
    mode: "chat" | "answer" = "chat",
    rules?: string,
    cachedChatMessages: any[] = [],
    customSettings: {
      temperature?: number;
      top_p?: number;
      frecuency_penalty?: number;
      presence_penalty?: number;
    } = {
      temperature: 0.7,
      top_p: 1,
      frecuency_penalty: 0,
      presence_penalty: 0,
    },
    maxTokens: number = 350
  ) {
    this.model = model;
    this.mode = mode;
    this.rules = rules;
    this.cachedChatMessages = cachedChatMessages;
    this.customSettings = customSettings;
    this.maxTokens = maxTokens;
  }

  #getGptModel() {
    const configuration = new Configuration({
      apiKey: apikey,
    });

    const openai = new OpenAIApi(configuration);
    return {
      openai,
      configuration: {
        ...this.customSettings,
        max_tokens: this.maxTokens,
      },
      model: this.model,
    };
  }

  async getModelAnswer(question: string) {
    question = textFormat(question) ?? "";

    const { openai, configuration, model } = this.#getGptModel();

    const response = await openai.createCompletion({
      model: model,
      prompt: question,
      ...configuration,
    });

    return {
      responses: response.data.choices,
      question,
      apiResponse: response,
    };
  }

  async getChatAnswer(question: string) {
    question = textFormat(question) ?? "";

    const { openai, configuration, model } = this.#getGptModel();

    const response = await openai.createChatCompletion({
      model: model,
      messages: [
        { role: "system", content: this.rules ?? "" },
        ...this.cachedChatMessages,
        { role: "user", content: question },
      ],
      ...configuration,
    });

    return {
      responses: response.data.choices,
      question,
      apiResponse: response,
    };
  }

  async getAnswer(question: string) {
    if (this.mode === "chat") return this.getChatAnswer(question);
    else return this.getModelAnswer(question);
  }
}
