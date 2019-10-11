module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Force all types into the largest available."
        },

        fixable: "code",

        schema: []

    },

    create(context) {
        sourceCode = context.getSourceCode();

        function inspectIdentifier(emitted) {
            const node = emitted.node,
                nodeText = sourceCode.getText(node);

            if (emitted.exit) {
                return;
            }

            if (node.literal && node.literal.type == "Type" && node.literal.literal.startsWith("uint") || node.literal.literal.startsWith("int")) {
                const errorObject = {
                    node,
                    fix(fixer) {
                        return [fixer.replaceText(node, nodeText.replace(/int[0-9]*/g, "int"))]
                    },
                    message: `Force large types`
                };

                context.report(errorObject);
                return;
            }
        }



        return {
            DeclarativeExpression: inspectIdentifier
        };
    }

};
