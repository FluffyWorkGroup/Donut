export function textFormat(text: string) {

    if (text.includes(`
    `)) {
        const split = text.split(`
        `);
        const ar = [];
        for (const x of split) {
            if (x.length < 2) ar.push(`${x}`);
            ar.push(`> **${x}**`);
        }
        console.log(ar)
        const formatted = ar.join("\n");
        return formatted;
    }

    if (text.includes("\n")) {
        const split = text.split("\n");
        const formatted = split.map((x) => `> **${x}**`).join("\n");
        return formatted;
    }

    if (text.length > 500) {
        const split = text.match(/.{1,500}/g);
        const formatted = split?.map((x) => `> **${x}**`).join("\n");
        return formatted;
    }

    if (text.includes("```")) {
        const split = text.split("```");
        const formatted = split?.map((x) => `> **${x}**`).join("\n");
        return formatted;
    }

    return `> **${text}**`;
}