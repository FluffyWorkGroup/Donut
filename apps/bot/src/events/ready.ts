import { createEvent } from "seyfert";

export default createEvent({
	data: { once: true, name: "ready" },
	run(user, client) {
		client.logger.info(`Logged in as ${user.tag}!`);
	},
});
