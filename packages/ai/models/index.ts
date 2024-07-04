import { BlackBox_models } from "./blackbox";
import { OpenAI_models } from "./openai";
import { gpt } from "./openai/gpt";

export const models = {
	openai: OpenAI_models,
	blackbox: BlackBox_models,
};
