require('events').EventEmitter.defaultMaxListeners = 0;
const assert = require('assert')
const ganache = require('ganache-cli');
const Web3 = require('web3')
const web3 = new Web3(ganache.provider());
const inbox = require('../compile');
const abiInterface = inbox.abi;
const bytecode =  inbox.evm.bytecode.object;
const INITIAL_MESSAGE = 'Hi, There';
const NEW_MESSAGE = "This is the new Message!";

//
// class Car {
//   park() {
//     return "stopped";
//   }
//   drive() {
//     return "vroom";
//   }
// }
// let car;
// beforeEach(() =>{
//    car = new Car();
// })
// describe('Car', () => {
//   it('can park', () => {
//   //  const car = new Car();
//     assert.equal(car.park(), 'stopped');
//   });
//   it('can drive', () => {
//   //  const car = new Car();
//     assert.equal(car.drive(), 'vroom');
//   });
//
let accounts;
let inboxContract;
beforeEach(async ()=> {
  //Get a list of all accounts


  accounts = await web3.eth.getAccounts();
  inboxContract = await new web3.eth.Contract(JSON.parse(JSON.stringify(abiInterface)))
  .deploy({data:bytecode, arguments:[INITIAL_MESSAGE]})
  .send({from: accounts[0], gas:'1000000'});
});


describe('Inbox', ()=> {
  it('deploys a contract', ()=> {
    //console.log(accounts);

   //console.log(inboxContract);
   assert.ok(inboxContract.options.address);
  });

  it('has a default message', async () => {
    const message = await inboxContract.methods.message().call();
    assert.equal(message, INITIAL_MESSAGE);
  });

  it('can change the message', async ()=>{
    await inboxContract.methods.setMessage(NEW_MESSAGE).send({from: accounts[0]});
    const message = await inboxContract.methods.message().call();
    assert.equal(message, NEW_MESSAGE);
  });
});
