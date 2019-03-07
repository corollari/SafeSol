module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Turn strict equality checks on balance into greater-or-equal checks."
        },

        fixable: "code",

        schema: []

    },

    create(context) {
        sourceCode = context.getSourceCode();

        function inspect(emitted) {
            const node = emitted.node,
                nodeText = sourceCode.getText(node);

            if (emitted.exit) {
                return;
            }
            let newOperator = "";
            if (node.operator == '==') {
                for (let i = 0; i < 2; i++) {
                    side = ['right', 'left'][i];
                    if (node[side].object && node[side].object.type == 'ThisExpression' && node[side].property && node[side].property.name == 'balance') {
                        newOperator = ['<=', '>='][i];
                        break;
                    }
                }
                if (newOperator != "") {
                    const errorObject = {
                        node,
                        fix(fixer) {
                            return [fixer.replaceText(node, nodeText.replace("==", newOperator))]
                        },
                        message: `non-strict balance check`
                    };

                    context.report(errorObject);
                }
            }
        }



        return {
            BinaryExpression: inspect
        };
    }

};