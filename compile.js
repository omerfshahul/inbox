const path = require('path');
const fs   = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'inbox.sol');

const compilerInput = {
    language: "Solidity",
    sources: {
        'inbox': { content: fs.readFileSync(inboxPath, 'utf8') }
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
  module.exports = compiledContract.contracts['inbox'].Inbox;

}
