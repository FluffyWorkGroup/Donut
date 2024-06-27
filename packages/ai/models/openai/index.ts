import OpenAI from "openai";
import { gpt } from "./gpt";

export const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export const OpenAI_models = {
	gpt,
};
