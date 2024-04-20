const { Web3 } = require("web3");

const web3 = new Web3("https://rpc.sepolia.org");

async function sendTxBatch(privateKeys, toAddresses, values) {
  const numberOfTransactions = privateKeys.length;

  const batch = new web3.eth.BatchRequest();

  for (let i = 0; i < numberOfTransactions; i++) {
    const privateKey = privateKeys[i];
    const toAddress = toAddresses[i];
    const value = values[i];

    const sender = web3.eth.accounts.privateKeyToAccount(privateKey);

    const txObject = {
      from: sender.address,
      to: toAddress,
      value,
      maxFeePerGas: Number((await web3.eth.getBlock("latest")).baseFeePerGas),
      maxPriorityFeePerGas: 10, // takes a while but cheap
      gasLimit: 21000,
    };

    const signature = await web3.eth.accounts.signTransaction(txObject, privateKey);
    const request = await createRequest(signature.rawTransaction);
    batch.add(request);
  }

  const response = await batch.execute();
  console.log(response);
}

async function createRequest(rawSignature) {
  return {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_sendRawTransaction",
    params: [`${rawSignature}`],
  };
}
