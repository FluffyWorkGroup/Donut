import { createEvent } from "seyfert";

export default createEvent({
    data: { once: true, name: "botReady" },
        run: (client) => {
        console.log(`Logged in as ${client.username}`);
    },
});
