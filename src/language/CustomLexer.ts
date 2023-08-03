import { DefaultLexer, LexerResult } from "langium";

export class CustomLexer extends DefaultLexer {
    override tokenize(text: string): LexerResult {
        const result = super.tokenize(text);
        for (const x of result.tokens) {
            console.log(x.tokenType.name+ ": " + x.image)
        }
        return result
    }
}