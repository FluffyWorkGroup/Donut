const maxMessageLength = 2000;

class TextExceedsMaxLength extends Error {
    constructor(message: any) {
        super(message);
        this.name = 'TextExceedsMaxLength';
    }
    }

export { maxMessageLength, TextExceedsMaxLength };