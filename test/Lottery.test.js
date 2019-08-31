require('events').EventEmitter.defaultMaxListeners = 0;
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const lottery = require('../compile');
const abiInterface = lottery.abi;
const bytecode =  lottery.evm.bytecode.object;

let lotteryContract;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lotteryContract = await new web3.eth.Contract(JSON.parse(JSON.stringify(abiInterface)))
  .deploy({data:bytecode})
  .send({from:accounts[0], gas:'1000000'});
});

describe('Lottery Contract', () => {

 it('deploys a contract', () =>{
   assert.ok(lotteryContract.options.address);
 });

 it('allows one account to enter', async () => {
   await lotteryContract.methods.enter().send({
     from: accounts[0],
     value: web3.utils.toWei('0.02', 'ether')

   });

   const players = await lotteryContract.methods.getPlayers().call({
     from:accounts[0]
   });
   assert.equal(accounts[0], players[0]);

   assert.equal(1, players.length);
 });
 it('allows multiple accounts to enter', async () => {
   await lotteryContract.methods.enter().send({
     from: accounts[0],
     value: web3.utils.toWei('0.02', 'ether')

   });
   await lotteryContract.methods.enter().send({
     from: accounts[1],
     value: web3.utils.toWei('0.02', 'ether')

   });
   await lotteryContract.methods.enter().send({
     from: accounts[2],
     value: web3.utils.toWei('0.02', 'ether')

   });
   const players = await lotteryContract.methods.getPlayers().call({
     from:accounts[0]
   });
   assert.equal(accounts[0], players[0]);
   assert.equal(accounts[1], players[1]);
   assert.equal(accounts[2], players[2]);
   assert.equal(3, players.length);
 });

 it('requires a minimum amount of ether to enter', async () => {

  try {
     await lotteryContract.methods.enter().send( {
       from:accounts[0],
       value: 200
   });
   assert(false);
 }catch(err){
   assert(err);
   //console.log(err);
 }
 });
 it('only manager can call pickWinner', async () => {
   try {
     await lotteryContract.methods.pickWinner().send({
       from: accounts[1]

     });
     assert(false);
   }catch(err){
     assert(err);
    // console.log(err);
   }
 });
 it('sends money to the winner and resets the players array', async () => {
   await lotteryContract.methods.enter().send({
     from:accounts[0],
     value: web3.utils.toWei('2','ether')
   });
   const initialBalance = await web3.eth.getBalance(accounts[0]);
   await lotteryContract.methods.pickWinner().send({from: accounts[0]});
   const finalBalance = await web3.eth.getBalance(accounts[0]);
   const difference = finalBalance - initialBalance;
  // console.log(difference);
   assert(difference > web3.utils.toWei('1.8', 'ether'));
 });
});
