grammar HelloWorld

entry Model:
    
    // >Either template literal parts with expressions in between
    (
        content+=TEMPLATE_LITERAL_START 
        content+=Expression?
        (
            content+=TEMPLATE_LITERAL_MIDDLE
            content+=Expression?
        )*
        content+=TEMPLATE_LITERAL_END
    )|
     // or just the full content
    content+=TEMPLATE_LITERAL_FULL? EOF
;

Expression:
    name=QualifiedName
;

QualifiedName returns string:
	ID ("." ID)*;



terminal TEMPLATE_LITERAL_START:
    IN_TEMPLATE_LITERAL? '{{';

terminal TEMPLATE_LITERAL_MIDDLE:
    '}}' IN_TEMPLATE_LITERAL? '{{';

terminal TEMPLATE_LITERAL_END:
    '}}' IN_TEMPLATE_LITERAL?;

terminal TEMPLATE_LITERAL_FULL:
    EOF; // will be switched in CustomTokenBuilder
    // /(([^{]|[{](?=[^{]))+)(?!.)/ ;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

// no escape hatches here so far
terminal fragment IN_TEMPLATE_LITERAL:
    /([^{]|[{](?=[^{]))+/;

terminal EOF: /\z/;