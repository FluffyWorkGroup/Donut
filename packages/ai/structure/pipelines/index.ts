import type { BlackBoxMessage } from "../../models/blackbox";
import { agents } from "../..";
import { regions } from "../../models/openai/gpt";
import { models as Models } from "../../index";
import type { APIPromise } from "openai/core.mjs";
import type { ChatCompletion } from "openai/resources/index.mjs";

const openai_models = [...regions] as const;
const blackbox_models = (
	Object.keys(agents) as (typeof agents)[keyof typeof agents][]
).map((agent) => agents[agent as keyof typeof agents]);
const models = [...openai_models, ...blackbox_models] as const;

function searchModel(model: (typeof models)[number]) {
	const openaiModels = Models.openai.gpt;
	const chatgpt = openaiModels.chat.normal;
	const blackboxModels = Models.blackbox;

	// call the function based on the model
	if (model in chatgpt)
		return chatgpt[model as keyof typeof chatgpt] as (
			messages: BlackBoxMessage[],
		) => Promise<APIPromise<ChatCompletion>>;
	if (model in blackboxModels)
		return blackboxModels[model as keyof typeof blackboxModels] as (
			messages: BlackBoxMessage[],
		) => Promise<string>;

	throw new Error(`Model ${model} not found`);
}

export async function ask(
	model: (typeof models)[number],
	messages: BlackBoxMessage[],
) {
	const foundModel = searchModel(model);
	const response = await foundModel(messages);

	return response;
}
