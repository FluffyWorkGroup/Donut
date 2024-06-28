import { DEBUG } from "@donut/common";
import chalk from "chalk";

const LogLevels = {
	DEBUG: 1,
	INFO: 2,
	WARN: 3,
	ERROR: 4,
} as const;

const LogColors = {
	[LogLevels.DEBUG]: chalk.gray,
	[LogLevels.INFO]: chalk.blue,
	[LogLevels.WARN]: chalk.yellow,
	[LogLevels.ERROR]: chalk.red,
};

const LogEmojis = {
	[LogLevels.DEBUG]: "🐛",
	[LogLevels.INFO]: "ℹ️",
	[LogLevels.WARN]: "⚠️",
	[LogLevels.ERROR]: "❌",
};

const LogPrefixes = new Map([
	[LogLevels.DEBUG, "DEBUG"],
	[LogLevels.INFO, "INFO"],
	[LogLevels.WARN, "WARN"],
	[LogLevels.ERROR, "ERROR"],
]);

export class Logger {
	readonly production;

	constructor() {
		this.production = !!DEBUG;
	}

	rawLog(
		level: (typeof LogLevels)[keyof typeof LogLevels],
		...args: unknown[]
	) {
		if (!this.production && level === LogLevels.DEBUG) return;
		const color = LogColors[level];
		const emoji = LogEmojis[level];
		const prefix = LogPrefixes.get(level) ?? "LOG";
		const label = `[${LogPrefixes.get(level) ?? "---"}] ${emoji} ${color(`[${new Date().toLocaleTimeString()}]`)}`;
		console[prefix.toLowerCase() as "log" | "warn" | "error" | "info"](
			label,
			...args,
		);
	}

	debug(...args: unknown[]) {
		this.rawLog(LogLevels.DEBUG, ...args);
	}

	info(...args: unknown[]) {
		this.rawLog(LogLevels.INFO, ...args);
	}

	warn(...args: unknown[]) {
		this.rawLog(LogLevels.WARN, ...args);
	}

	error(...args: unknown[]) {
		this.rawLog(LogLevels.ERROR, ...args);
	}
}
