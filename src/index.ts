import {
    CompleteResult,
    ExtensionContext,
    sources,
    workspace,
} from "coc.nvim";
import {error} from "console";
import fs from "fs";

export async function activate(context: ExtensionContext): Promise<void> {
    context.subscriptions.push(
        sources.createSource({
            name: "tailwind completion source", // unique id
            doComplete: async () => {
                const items = await getCompletionItems();
                return items;
            },
        }),
    );
}

let classes: {id: string; type: string}[];
import("../classes.json").then(c => classes = c)

async function getCompletionItems(): Promise<CompleteResult> {
    const state = await workspace.getCurrentState();
    const currentLine = await workspace.nvim.line;
    const currentWord = getTextUnderCursor(currentLine, state.position.character)
        .trim();

    /// FIXME: A good algorithm to detect if we're in a tailwind context
    if (!currentLine.includes("tw`")) {
        return {items: []};
    }

    const items = classes.filter((c) => c.id.includes(currentWord)).map((c) => {
        return {word: c.id, menu: c.type};
    });
    return {
        items,
    };
}

export function getTextUnderCursor(line: string, pos: number): string {
    let end = line.slice(pos).indexOf(" ");
    if (end == -1) end = line.length;

    let start = line.slice(0, pos).lastIndexOf(" ");
    if (start == -1) start = 0;

    return line.slice(start, end);
}
