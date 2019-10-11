module.exports = {

    meta: {

        docs: {
            recommended: true,
            type: "error",
            description: "Force the use of SafeMath."
        },

        fixable: "code",

        schema: []

    },

    create(context) {
        sourceCode = context.getSourceCode();
        insertedUsing = false;

        function inspectBinary(emitted) {
            const node = emitted.node,
                nodeText = sourceCode.getText(node);

            if (emitted.exit) {
                return;
            }
            const operations = [{
                op: '+',
                call: 'add'
            }, {
                op: '*',
                call: 'mul'
            }, {
                op: '-',
                call: 'sub'
            }, {
                op: '/',
                call: 'div'
            }, {
                op: '%',
                call: 'mod'
            }];
            for (let i = 0; i < operations.length; i++) {
                let operation = operations[i];
                if (node.operator == operation.op) {
                    const errorObject = {
                        node,
                        fix(fixer) {
                            return [fixer.insertTextAfter(node, ")"), fixer.replaceText(node, nodeText.replace(new RegExp('\\' + operation.op, "g"), '.' + operation.call + '('))];
                        },
                        message: `non-strict balance check`
                    };

                    context.report(errorObject);
                    return;
                }
            }
        }

        function inspectContractStatement(emitted) {
            const node = emitted.node,
                nodeText = sourceCode.getText(node);

            if (emitted.exit) {
                return;
            }
            if (sourceCode.getText().includes('\nusing SafeMath for uint;\n' +
                    'using SignedSafeMath for int;')) {
                return;
            }
            const errorObject = {
                node,
                fix(fixer) {
                    return [fixer.insertTextBefore(node, '\nusing SafeMath for uint;\n' +
                        'using SignedSafeMath for int;\n')];
                },
                message: `non-strict balance check`
            };

            context.report(errorObject);
            return;
        }

        function inspectPragma(emitted) {
            const node = emitted.node,
                nodeText = sourceCode.getText(node);

            if (emitted.exit) {
                return;
            }
            if (sourceCode.getText().includes('\nimport "contracts/SafeMath.sol";\n' +
                    'import "contracts/SignedSafeMath.sol";\n')) {
                return;
            }

            const errorObject = {
                node,
                fix(fixer) {
                    return [fixer.insertTextAfter(node, '\nimport "contracts/SafeMath.sol";\n' +
                        'import "contracts/SignedSafeMath.sol";\n')];
                },
                message: `non-strict balance check`
            };

            context.report(errorObject);
            return;
        }


        return {
            BinaryExpression: inspectBinary,
            FunctionDeclaration: inspectContractStatement,
            PragmaStatement: inspectPragma,
        };
    }

};
