import { DefaultTokenBuilder, isTokenTypeArray, GrammarAST } from "langium";
import { IMultiModeLexerDefinition, TokenType, TokenVocabulary,EOF } from "chevrotain";

//const START_MODE  = 'start_mode';
const REGULAR_MODE  = 'regular_mode';
const TEMPLATE_MODE = 'template_mode';

export class CustomTokenBuilder extends DefaultTokenBuilder {

    override buildTokens(grammar: GrammarAST.Grammar, options?: { caseInsensitive?: boolean }): TokenVocabulary {
        const tokenTypes = super.buildTokens(grammar, options);
        //return tokenTypes;
        if(isTokenTypeArray(tokenTypes)) {
            // Regular mode just drops template literal middle & end

            // const startModeTokens = tokenTypes;
            // console.log("start:" + startModeTokens.map(e=>e.name));

            const regularModeTokens = tokenTypes
                .filter(token => ['TEMPLATE_LITERAL_START','TEMPLATE_LITERAL_FULL'].includes(token.name));
            console.log("reg:" + regularModeTokens.map(e=>e.name));

            // Template mode needs to exclude the '}' keyword
            const templateModeTokens = tokenTypes
                .filter(token => !['}','TEMPLATE_LITERAL_FULL','TEMPLATE_LITERAL_START'].includes(token.name));
            console.log("tmp: " + templateModeTokens.map(e=>e.name));

            const multiModeLexerDef: IMultiModeLexerDefinition = {
                modes: {
                    [REGULAR_MODE]: regularModeTokens,
                    [TEMPLATE_MODE]: templateModeTokens,
                    //[START_MODE]: startModeTokens
                },
                defaultMode: REGULAR_MODE
            };
            return multiModeLexerDef;
        } else {
            throw new Error('Invalid token vocabulary received from DefaultTokenBuilder!');
        }
    }

    protected override buildKeywordToken(
        keyword: GrammarAST.Keyword,
        terminalTokens: TokenType[],
        caseInsensitive: boolean
    ): TokenType {
        let tokenType = super.buildKeywordToken(keyword, terminalTokens, caseInsensitive);
        console.log(tokenType.name + " :x " + tokenType.LONGER_ALT)
        if (tokenType.name === '.') {
            // The default . token will use [TEMPLATE_LITERAL_MIDDLE, TEMPLATE_LITERAL_END] as longer alts
            // We need to delete the LONGER_ALT, they are not valid for the regular lexer mode
            delete tokenType.LONGER_ALT;
        }
        return tokenType;
    }

    protected override buildTerminalToken(terminal: GrammarAST.TerminalRule): TokenType {
        let tokenType = super.buildTerminalToken(terminal);
        if (tokenType.name === 'EOF') {
            console.log("uiuiiui")
            tokenType = EOF;
        }
        if (tokenType.name === 'TEMPLATE_LITERAL_FULL') {
            tokenType.PATTERN =/(([^{]|[{](?=[^{]))+)(?!.)/;
        }
        // Update token types to enter & exit template mode
        if(tokenType.name === 'TEMPLATE_LITERAL_START') {
            console.log("push")
            tokenType.PUSH_MODE = TEMPLATE_MODE;
        } else if(tokenType.name === 'TEMPLATE_LITERAL_END') {
            console.log("pop");
            tokenType.POP_MODE = true;
        }
        console.log(tokenType.name + " : " + tokenType.LONGER_ALT + " -> " + tokenType.PATTERN)

        return tokenType;
    }
}