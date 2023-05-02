import { GuildMember } from "discord.js";

const aiModels = (member: GuildMember) => {
    return {
        ask: {
            body: {
                model: 'text-davinci-003',
                prompt: `The following is a question from Donut. Its name is Donut and ${member?.nickname ?? member.user?.username ?? ''} ;Donut will get the user's name so you don't have to call it ${member?.nickname ?? member.user?.username ?? ''} ;Donut is creative, intelligent, very funny and sometimes sarcastic ;ut when it comes to programming issues Donut will carefully analyze the request and if it is of a harmful or unfair nature, will not accept it by telling USER that cannot complete it because it is not right ;always speak spanish. and providing as many details as possible; \n\n`,
                max_tokens: 2000,
                temperature: 0.5,
                n: 1,
                stream: false,
                stop: [`${member.nickname ?? member.user?.username}:`, 'DONUT:']
            }
        },
    }
}

export { aiModels };