import {
    createDefaultModule, createDefaultSharedModule, DefaultSharedModuleContext, inject,
    LangiumServices, LangiumSharedServices, Module, PartialLangiumServices
} from 'langium';
import { HelloWorldGeneratedModule, HelloWorldGeneratedSharedModule } from './generated/module';
import { HelloWorldValidator, registerValidationChecks } from './hello-world-validator';
import { CustomTokenBuilder } from './CustomTokenBuilder';
import { CustomLexer } from './CustomLexer';
import { CustomCompletionProvider } from './CustomCompletionProvider';
//import { CustomCompletionProvider } from './CustomCompletionProvider';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type HelloWorldAddedServices = {
    validation: {
        HelloWorldValidator: HelloWorldValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type HelloWorldServices = LangiumServices & HelloWorldAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const HelloWorldModule: Module<HelloWorldServices, PartialLangiumServices & HelloWorldAddedServices> = {
    validation: {
        HelloWorldValidator: () => new HelloWorldValidator()
    },
    parser: {
        TokenBuilder: () => new CustomTokenBuilder(),
        Lexer: (services) => new CustomLexer(services)
    },
    lsp: {
        CompletionProvider: (services) => new CustomCompletionProvider(services)
    }
};

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createHelloWorldServices(context: DefaultSharedModuleContext): {
    shared: LangiumSharedServices,
    HelloWorld: HelloWorldServices
} {
    const shared = inject(
        createDefaultSharedModule(context),
        HelloWorldGeneratedSharedModule
    );
    const HelloWorld = inject(
        createDefaultModule({ shared }),
        HelloWorldGeneratedModule,
        HelloWorldModule
    );
    shared.ServiceRegistry.register(HelloWorld);
    registerValidationChecks(HelloWorld);
    return { shared, HelloWorld };
}
