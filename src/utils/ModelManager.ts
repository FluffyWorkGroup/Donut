import { Configuration, OpenAIApi } from 'openai'
import { GuildMember } from 'discord.js'
import { maxMessageLength, TextExceedsMaxLength } from './errorManager'
import { aiModels } from '../config/models'
import { apikey } from '../config.json';


const openai_config = new Configuration({ apiKey: apikey });

export class AskManager extends OpenAIApi {
    name: string;
    discordConfig: {
        member: GuildMember
    }
    body: ReturnType<typeof aiModels>['ask']
    defaultPrompt: string;

    constructor(discordConfig: { member: GuildMember }) {
        super(openai_config);
        this.name = 'ask';
        this.discordConfig = discordConfig;
        // @ts-ignore
        this.body = aiModels(discordConfig.member)[this.name]
        this.defaultPrompt = this.body.body.prompt;
    }


    async generate_answer(prompt: string) {
        console.log(`Pregunta del usuario: ${prompt}`);
        console.log(`Generando respuesta...`);
        
        const question = `${this.body.body.stop[0]} ${prompt}\n${this.body.body.stop[1]} `;
        this.body.body.prompt = this.defaultPrompt + question;

        try {
            const response = await super.createCompletion(this.body.body);

            console.log('Status:', response.status, response.statusText);
            let answer = response.data.choices[0]?.text?.trim();
            if ((answer?.length ?? 0) < 1) answer = undefined

            if ((answer?.length ?? 0) > maxMessageLength) {
                throw new TextExceedsMaxLength("Generando respuesta excede la longitud máxima del mensaje de discord");
            }

            return answer;

        } catch (err: any) {

            console.error(err.message);
            return;
        }
    }
}



// Export the following classes
module.exports = { AskManager };