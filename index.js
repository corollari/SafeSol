const balanceComparisons = require("./rules/balanceComparisons")
const forceTypesLargest = require("./rules/forceTypesLargest")
const SafeMath = require("./rules/SafeMath")
const txOrigin = require("./rules/txOrigin")

module.exports = {
        meta: {
                description: 'Training wheels for Solidity'
        },
        rules: {
			balanceComparisons,
			forceTypesLargest,
			SafeMath,
			txOrigin
        }
};
