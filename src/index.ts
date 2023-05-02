import { Client } from "discord.js";
import { readdirSync } from "fs";
import config from "./config.json";
import { lstat, readdir } from "fs/promises";
import { join } from "path";

const client = new Client({
  intents: [
    3276799
  ],
});

client.once('ready', async () => {
  console.log("✅ - DonutGPT esta sirviendo")
})

client.login(config.token);

function handlers(client: Client) {
  (async function handleEvents(dir = "./handler") {
    let files = await readdir(join(__dirname, dir));
    for (let file of files) {
      let stat = await lstat(join(__dirname, dir, file));
      if (stat.isDirectory()) {
        await handleEvents(join(dir, file));
      } else {
        if (!file.endsWith(".ts")) continue;
        let eventName = file.substring(0, file.indexOf(".ts"));
        try {
          let event = await import(join(__dirname, dir, file));
          console.log(event)
          client.on(eventName, event.default.bind(client, client));
        } catch (e) {
          console.error(`El evento ${eventName} falló al importarse: \n${e}`);
        }
      }
    }
  })()
}

handlers(client);

