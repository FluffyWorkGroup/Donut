import { logger } from "../..";
import { agents } from "../../agents/blackbox";

export interface BlackBoxMessage {
	content: string;
	id: string;
	role: "user" | "assistant" | "system";
}

async function fetchResponse(
	messages: BlackBoxMessage[],
	agent: keyof typeof agents = "donut",
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
			agentMode: agent ? { mode: true, id: agents[agent] } : { mode: false },
			trendingAgentMode: {},
			isMicMode: false,
			maxTokens: 1024,
		}),
	});

	logger.debug("Response from BlackBox.ai", response);

	return formatMessage(await response.text());
}

function formatMessage(message: string): string {
	return message.replace(/\$@\$(v=[^$@]+)\$@\$/g, "");
}

export const BlackBox_models = Object.keys(agents).reduce(
	(acc, agent) => {
		acc[agent as keyof typeof agents] = async (messages: BlackBoxMessage[]) =>
			fetchResponse(messages, agent as keyof typeof agents);
		return acc;
	},
	{} as Record<
		keyof typeof agents,
		(messages: BlackBoxMessage[]) => Promise<string>
	>,
);
