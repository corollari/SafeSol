module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Convert tx.origin to msg.sender."
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

            if (node.name == "origin" && node.parent && node.parent.object && node.parent.object.name == "tx") {
                const errorObject = {
                    node,
                    fix(fixer) {
                        return [fixer.replaceText(node, "sender")]
                    },
                    message: `tx.origin -> msg.sender.`
                };

                context.report(errorObject);
            } else if (node.name == "tx" && node.parent && node.parent.property && node.parent.property.name == "origin") {
                const errorObject = {
                    node,
                    fix(fixer) {
                        return [fixer.replaceText(node, "msg")]
                    },
                    message: `tx.origin -> msg.sender.`
                };

                context.report(errorObject);
            }
        }



        return {
            Identifier: inspectIdentifier
        };
    }

};