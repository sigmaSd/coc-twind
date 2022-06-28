#!/usr/bin/env -S deno run -A --unstable
const raw = await fetch("https://tailwind.build/classes").then((r) => r.text());
const classes = [...raw.matchAll(/\/classes\/(.*?)"/g)].map((r) => r[1]).map(
    (r) => {
        return {id: r.split("/")[1], type: r.split("/")[0]};
    },
);

Deno.writeTextFileSync("./classes.json", JSON.stringify(classes));
Deno.spawnSync(Deno.execPath(), {args: ["fmt", "./classes.json"]})
