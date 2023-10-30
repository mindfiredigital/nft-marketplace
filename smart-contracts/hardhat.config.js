require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {

    },
    // sepolia: {
    //   url: "https://sepolia.infura.io/v3/<key>",
    //   accounts: ["", "", ""]
    // }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
