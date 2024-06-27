export class InvalidEnviroment extends Error {
	constructor(message: string) {
		super(message);
		this.name = "Donut [InvalidEnvironment]";
	}
}
