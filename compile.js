const path = require('path');
const fs   = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');

const compilerInput = {
    language: "Solidity",
    sources: {
        'Lottery': { content: fs.readFileSync(lotteryPath, 'utf8') }
    },
    settings: {
      outputSelection: {
        "*": {
          "*": [ "abi", "evm.bytecode" ]
        }
      }
    }
};

const  compiledContract = JSON.parse(solc.compile(JSON.stringify(compilerInput)));


if (compiledContract.errors) {
  compiledContract.errors.forEach(err => {
    console.log(err.formattedMessage);
  });
}
else {
//  console.log(compiledContract);
//  console.log(compiledContract.contracts['inbox'].Inbox.evm.bytecode.object);
  module.exports = compiledContract.contracts['Lottery'].Lottery;

}
