import { Logger } from "seyfert";
import { LogLevels } from "seyfert/lib/common";
import type { ChalkInstance } from "chalk";
import chalk from "chalk";

/**
 * Add padding to the label.
 * @param label
 * @returns
 */

function addPadding(label: string): string {
	const maxLength = 6;
	const bar = "|";

	const spacesToAdd = maxLength - label.length;
	if (spacesToAdd <= 0) return bar;

	const spaces = " ".repeat(spacesToAdd);
	return spaces + bar;
}

/**
 * Formats memory usage data into a human-readable string.
 * @param memory The memory usage data.
 * @returns
 */

function formatMemory(memory: number): string {
	const gigaBytes = memory / 1024 ** 3;
	if (gigaBytes >= 1) return `[RAM: ${gigaBytes.toFixed(3)} GB]`;

	const megaBytes = memory / 1024 ** 2;
	if (megaBytes >= 1) return `[RAM: ${megaBytes.toFixed(3)} MB]`;

	const kiloBytes = memory / 1024;
	if (kiloBytes >= 1) return `[RAM: ${kiloBytes.toFixed(3)} KB]`;

	return `[RAM: ${memory} B]`;
}

/**
 * Send ascii text
 * @returns
 */

export function getWatermark(): void {
	console.info(
		chalk.green(`
            
████████▄   ▄██████▄  ███▄▄▄▄   ███    █▄      ███     
███   ▀███ ███    ███ ███▀▀▀██▄ ███    ███ ▀█████████▄ 
███    ███ ███    ███ ███   ███ ███    ███    ▀███▀▀██ 
███    ███ ███    ███ ███   ███ ███    ███     ███   ▀ 
███    ███ ███    ███ ███   ███ ███    ███     ███     
███    ███ ███    ███ ███   ███ ███    ███     ███     
███   ▄███ ███    ███ ███   ███ ███    ███     ███     
████████▀   ▀██████▀   ▀█   █▀  ████████▀     ▄████▀   
                                                       
									${chalk.italic("→ By cheree")}
            `),
	);
}

/**
 * Customize the Logger.
 * @param _this
 * @param level
 * @param args
 * @returns
 */

export function customLogger(
	_logger: Logger,
	level: LogLevels,
	args: unknown[],
): unknown[] | undefined {
	const date: Date = new Date();
	const memory: NodeJS.MemoryUsage = process.memoryUsage();

	const label: string = Logger.prefixes.get(level) ?? "---";
	const timeFormat: string = `[${date.toLocaleDateString()} L ${date.toLocaleTimeString()}]`;

	const emojis: Record<LogLevels, string> = {
		[LogLevels.Debug]: "🐛",
		[LogLevels.Error]: "❌",
		[LogLevels.Info]: "ℹ️",
		[LogLevels.Warn]: "⚠️",
		[LogLevels.Fatal]: "💀",
	};

	const colors: Record<LogLevels, ChalkInstance> = {
		[LogLevels.Debug]: chalk.grey,
		[LogLevels.Error]: chalk.red,
		[LogLevels.Info]: chalk.blue,
		[LogLevels.Warn]: chalk.yellow,
		[LogLevels.Fatal]: chalk.red,
	};

	const text = `${chalk.grey(`${timeFormat}`)} ${chalk.grey(formatMemory(memory.rss))} ${emojis[level]} [${colors[level](label)}] ${addPadding(label)}`;

	return [text, ...args];
}
