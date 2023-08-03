import { CompletionAcceptor, CompletionContext, DefaultCompletionProvider, NextFeature } from "langium";
import { AbstractElement, AbstractRule } from "langium/lib/grammar/generated/ast";

export class CustomCompletionProvider extends DefaultCompletionProvider {
    protected override completionForRule(context: CompletionContext, rule: AbstractRule, acceptor: CompletionAcceptor): Promise<void> {
        
        acceptor({
            label: "Demo",
            insertText: "demo"
        })
        const dflt = super.completionForRule(context,rule,acceptor)
        return dflt;
    }

    protected override completionForContexts(contexts: CompletionContext[], next: NextFeature<AbstractElement>, acceptor: CompletionAcceptor): Promise<void> {
        acceptor({
            label: "Demo",
            insertText: "demo"
        })
       return super.completionForContexts(contexts,next,acceptor)
    }
}