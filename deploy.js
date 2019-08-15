const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const inbox = require('./compile');
const interface = inbox.abi;
const bytecode = inbox.evm.bytecode.object;
const INITIAL_MESSAGE = 'Hi, There';
const NEW_MESSAGE = "This is the new Message!";

const provider = new HDWalletProvider(
  'agent allow treat mother host welcome square ride hope stick differ castle',
  'https://rinkeby.infura.io/v3/dd48cdbc04e34e9d9e7ff0cd52e69706'
);

const web3 = new Web3(provider);

const deploy = async () => {

   const accounts = await web3.eth.getAccounts();
   console.log('Attempting to deploy from account', accounts[0]);
   const result = await new web3.eth.Contract(JSON.parse(JSON.stringify(interface)))
    .deploy({data: '0x'+bytecode, arguments:[INITIAL_MESSAGE]})
    .send({gas: '1000000', from:accounts[0]});
    console.log('Contract deployed to', result.options.address);
};

deploy();
