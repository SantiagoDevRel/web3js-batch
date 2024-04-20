const { Web3 } = require("web3");

const web3 = new Web3("https://rpc.sepolia.org");

async function getGasPricesForLast200Blocks() {
  const latestBlockNumber = BigInt(await web3.eth.getBlockNumber());
  const blockNumbers = Array.from({ length: 200 }, (_, i) => latestBlockNumber - BigInt(i));

  let baseFeePerGasValues = [];

  for (let i = 0; i < blockNumbers.length; i++) {
    const blockNumber = blockNumbers[i];
    const block = await web3.eth.getBlock(blockNumber);

    if (block) {
      const baseFeePerGas = block.baseFeePerGas;
      if (baseFeePerGas) {
        baseFeePerGasValues.push(baseFeePerGas);
      }
    }
  }

  return baseFeePerGasValues;
}

async function analyzeGasPrices() {
  const baseFeePerGasValues = await getGasPricesForLast200Blocks();

  // Calculate average gas price
  const averageGasPrice = baseFeePerGasValues.reduce((acc, val) => acc + val, BigInt(0)) / BigInt(baseFeePerGasValues.length);

  // Find minimum gas price
  const minGasPrice = baseFeePerGasValues.reduce((min, val) => (val < min ? val : min), baseFeePerGasValues[0]);

  console.log("Average Gas Price:", averageGasPrice.toString());
  console.log("Minimum Gas Price:", minGasPrice.toString());
  console.log("Current Gas Price:", (await web3.eth.getBlock()).baseFeePerGas);
}

analyzeGasPrices();
