import { logger } from "../..";
import { agents } from "../../agents/blackbox";

export interface BlackBoxMessage {
	content: string;
	id: string;
	role: "user" | "assistant";
}

async function fetchResponse(
	messages: BlackBoxMessage[],
	agent: keyof typeof agents,
) {
	logger.debug("Fetching response from BlackBox.ai");

	const response = await fetch("https://www.blackbox.ai/api/chat", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify({
			messages: messages,
			previewToken: undefined,
			codeModelModel: true,
			agentMode: {
				mode: true,
				id: "donutdBdXXgi",
			},
			trendingAgentMode: {},
			isMicMode: false,
			maxTokens: 1024,
		}),
	});

	logger.debug("Response from BlackBox.ai", response);

	return response.text();
}

export const BlackBox_models = Object.values(agents).reduce(
	(acc, agent) => {
		acc[agent] = async (messages: BlackBoxMessage[]) =>
			fetchResponse(messages, agent);
		return acc;
	},
	{} as Record<
		keyof typeof agents,
		(messages: BlackBoxMessage[]) => Promise<string>
	>,
);
