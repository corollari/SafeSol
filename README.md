# SafeSol
> Training wheels for solidity

**This is a Proof Of Concept that has not been formally verified, use at your own risk**

## What SafeSol is
- Training wheels for Solidity

## What SafeSol is not
- Security silver bullet that automagically makes your contract secure
- A replacement or competitor of Solidity: SafeSol is targeted at novice users who aren't aware of all the pitfalls and subtle security considerations of Solidity, experienced users should not use it.

## Features
- **Built-in SafeMath**: No more writting '.add()' or '.sub()', get automatic overflow/underflow protection without worrying about it!
- **Non-strict equality checks on contract balance**: If a contract does strict equality checks on its balance it's possible for an attacker to make these checks fail by sending 1 wei to the selfdestruct function. SafeSol solves that by turning all strict checks into non-strict checks.
- **Conversion from tx.origin to msg.sender**: According to Consensys' documentation, there's been some misuse of tx.origin to identify the transaction sender, which could lead to vulnerabilities. This feature prevents that by replacing tx.origin with msg-sender, which is safe to use for authentication.
- **Force oversized types**: Using bigger variables doesn't incur a lot of costs and can avoid many problems down the line, therefore SafeSol always uses big types. Linked with var resolution.
<!--
- **Checks on external function calls**: It's pretty easy to forget about checking the return value of an external function call, therefore opening the door for vulnerabilities that can be triggered when the external function call fails. SafeSol prevents that by automatically adding checks on external function calls and reverting the state if the call fails.
- **Reentrancy**: Not currently a feature, if you have an idea on how this could be implemented without altering the drop-in nature of SafeSol please open an issue or contact me.
- **var resolution**: Solidity's type resolution of variables defined using the "var" keyword can lead to some unexpected results that lead to vulnerabilities. SafeSol makes var resolve to the biggest types to prevent these issues.
- **Force local variables to memory**: Declaring arrays or structs inside a function without specifying the storage modifier will lead to them being classified as storage variables, and, as new storage is not being allocated, writing values to them will overwrite other storage variables. This is an extremely dangerous pitfall due to the fact that in every other language under the sun local variables are local and don't modify the state of other stuff, so programmers just assume that'll also be true for Solidity. SafeSol avoids that pitfall by applying the memory modifier to all unspecified local variables.
-->

## How to use it
```bash
npm install safesol
```

## Implementation
Originally, this project started as a fork of the Solidity compiler, but, due to the constant changes in that codebase and the fact that, due to the way the compiler is structured some features of SafeSol were hard to implement, I moved away from that to a solution based on generating AST from the Solidity source code of a smart contract, operating on that AST to incorporate SafeSol features and then compiling the result. Unfortunately currently there doesn't exist any AST-to-Solidity code generator so right now SafeSol is using Solium/Ethlint, which allows for the creation of rules that operate on the source code using the AST as a reference.
Operating on the source code directly is not a good solution, as it has previously introduced many subtle bugs and makes some features quite hard to implement, therefore the path forward for SafeSol is to develop an AST-to-Solidity generator and rewrite SafeSol using that.
