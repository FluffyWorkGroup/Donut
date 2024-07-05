import type {
	ChatCompletion,
	ChatCompletionChunk,
	ChatCompletionMessageParam,
	ChatModel,
} from "openai/resources/index.mjs";
import { openai } from ".";
import type { APIPromise } from "openai/core.mjs";
import type { Stream } from "openai/streaming.mjs";
import type {
	Completion,
	CompletionCreateParamsBase,
	CompletionCreateParamsNonStreaming,
} from "openai/resources/completions.mjs";
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";
import { logger } from "../..";

export const regions: ChatModel[] = [
	"gpt-4o",
	"gpt-4o-2024-05-13",
	"gpt-4-turbo",
	"gpt-4-turbo-2024-04-09",
	"gpt-4-0125-preview",
	"gpt-4-turbo-preview",
	"gpt-4-1106-preview",
	"gpt-4-vision-preview",
	"gpt-4",
	"gpt-4-0314",
	"gpt-4-0613",
	"gpt-4-32k",
	"gpt-4-32k-0314",
	"gpt-4-32k-0613",
	"gpt-3.5-turbo",
	"gpt-3.5-turbo-16k",
	"gpt-3.5-turbo-0301",
	"gpt-3.5-turbo-0613",
	"gpt-3.5-turbo-1106",
	"gpt-3.5-turbo-0125",
	"gpt-3.5-turbo-16k-0613",
];

export const nonStreamingRegions: CompletionCreateParamsBase["model"][] = [
	"gpt-3.5-turbo-instruct",
	"davinci-002",
	"babbage-002",
];

/**
 * Sends a chat completion request to the OpenAI API.
 *
 * @param model - The chat model to use for the completion.
 * @param params - The chat completion message parameters.
 * @param stream - A boolean indicating whether to stream the completion or not.
 * @returns A promise that resolves to the API response containing the completion result, or undefined if there was an error.
 */
async function chatBaseRequest(
	model: ChatModel,
	params: ChatCompletionMessageParam[],
	stream: boolean,
	optionalParams: Omit<
		ChatCompletionCreateParamsBase,
		"model" | "messages" | "stream"
	> = {},
): Promise<
	APIPromise<Stream<ChatCompletionChunk> | ChatCompletion> | undefined
> {
	logger.debug("chatBaseRequest", model, params, stream, optionalParams);
	const response = await openai.chat.completions.create({
		model,
		messages: params,
		stream,
		...optionalParams,
	});

	logger.debug("chatBaseRequest response", response);

	if (!response) return undefined;

	return response;
}

/**
 * Sends a completion request to the OpenAI API.
 * @param model The model to use for the completion request.
 * @param params The prompt or input for the completion request.
 * @param optionalParams Optional parameters for the completion request.
 * @returns A promise that resolves to the completion response from the API, or undefined if the response is empty.
 */
async function completionRequest(
	model: CompletionCreateParamsBase["model"],
	params: string | string[] | number[] | number[][] | null,
	optionalParams: Omit<
		CompletionCreateParamsNonStreaming,
		"model" | "prompt"
	> = {},
): Promise<APIPromise<Completion> | undefined> {
	const response = await openai.completions.create({
		model,
		prompt: params,
		...optionalParams,
	});

	logger.debug("completionRequest response", response);

	if (!response) return undefined;

	return response;
}

/**
 * The `gpt` object contains methods for interacting with the GPT model.
 */
export const gpt = {
	/**
	 * The `chat` object contains methods for generating chat completions using the GPT model.
	 */
	chat: {
		/**
		 * The `stream` method generates chat completions using the GPT model in a streaming fashion.
		 * @param params - An array of chat completion message parameters.
		 * @param optionalParams - Optional parameters for the chat completion request.
		 * @returns A promise that resolves to the API response containing a stream of chat completion chunks.
		 */
		stream: regions.reduce(
			(acc, region) => {
				acc[region] = async (
					params: ChatCompletionMessageParam[],
					optionalParams:
						| Omit<
								ChatCompletionCreateParamsBase,
								"model" | "messages" | "stream"
						  >
						| undefined = {},
				): Promise<APIPromise<Stream<ChatCompletionChunk>>> =>
					chatBaseRequest(region, params, true, optionalParams) as Promise<
						APIPromise<Stream<ChatCompletionChunk>>
					>;
				return acc;
			},
			{} as Record<
				ChatModel,
				(
					params: ChatCompletionMessageParam[],
					optionalParams?:
						| Omit<
								ChatCompletionCreateParamsBase,
								"model" | "messages" | "stream"
						  >
						| undefined,
				) => Promise<APIPromise<Stream<ChatCompletionChunk>>>
			>,
		),
		/**
		 * The `normal` method generates chat completions using the GPT model in a non-streaming fashion.
		 * @param params - An array of chat completion message parameters.
		 * @param optionalParams - Optional parameters for the chat completion request.
		 * @returns A promise that resolves to the API response containing the chat completion.
		 */
		normal: regions.reduce(
			(acc, region) => {
				acc[region] = async (
					params: ChatCompletionMessageParam[],
					optionalParams:
						| Omit<
								ChatCompletionCreateParamsBase,
								"model" | "messages" | "stream"
						  >
						| undefined = {},
				): Promise<APIPromise<ChatCompletion>> =>
					chatBaseRequest(region, params, false, optionalParams) as Promise<
						APIPromise<ChatCompletion>
					>;
				return acc;
			},
			{} as Record<
				ChatModel,
				(
					params: ChatCompletionMessageParam[],
					optionalParams?:
						| Omit<
								ChatCompletionCreateParamsBase,
								"model" | "messages" | "stream"
						  >
						| undefined,
				) => Promise<APIPromise<ChatCompletion>>
			>,
		),
	},
	/**
	 * The `completions` object contains methods for generating completions using the GPT model in non-streaming regions.
	 * @param params - The prompt or input for the completion request.
	 * @param optionalParams - Optional parameters for the completion request.
	 * @returns A promise that resolves to the completion response from the API.
	 */
	completions: nonStreamingRegions.reduce(
		(acc, region) => {
			acc[region] = async (
				params: string | string[] | number[] | number[][],
				optionalParams:
					| Omit<CompletionCreateParamsNonStreaming, "model" | "prompt">
					| undefined = {},
			): Promise<APIPromise<Completion>> =>
				completionRequest(region, params, optionalParams) as Promise<
					APIPromise<Completion>
				>;
			return acc;
		},
		{} as Record<
			CompletionCreateParamsBase["model"],
			(
				params: string | string[] | number[] | number[][],
				optionalParams?:
					| Omit<CompletionCreateParamsNonStreaming, "model" | "prompt">
					| undefined,
			) => Promise<APIPromise<Completion>>
		>,
	),
};
