const Solium = require('solium');
const fs = require('fs');
const solc = require('solc');
const argv = require('process').argv;

try {
    let result = fs.readFileSync(argv[2]);

    for (let i = 0; i < 3; i++) {
        result = Solium.lintAndFix(result, {
            "extends": "solium:recommended",
            "plugins": [],
            "rules": {
                "txOrigin": ["error"],
                "SafeMath": ["error"],
                "forceTypesLargest": ["error"],
                "balanceComparisons": ["error"]
            },

            "options": {
                "returnInternalIssues": true
            }
        }).fixedSourceCode;
    }

    var input = {
        language: 'Solidity',
        sources: {
            [argv[2]]: {
                content: result
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }

    var output = JSON.parse(solc.compile(JSON.stringify(input)))

    // `output` here contains the JSON output as specified in the documentation
    for (var contractName in output.contracts[argv[2]]) {
        console.log(contractName + ': ' + output.contracts[argv[2]][contractName].evm.bytecode.object)
    }
} catch (e) {
    console.error("There's an error in your contract");
}