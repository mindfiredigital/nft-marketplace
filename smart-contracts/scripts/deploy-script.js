const hre = require("hardhat");

async function main() {

    // fetch different accounts
    [firstUser, secondUser, thirdUser] = await ethers.getSigners();
    console.log(`Deploying contracts with the account :- ${firstUser.address}`);

    // deploy Fandom token contract
    const fandomToken = await hre.ethers.getContractFactory("FandomToken");
    const FandomToken = await fandomToken.deploy("https://gateway.pinata.cloud/ipfs/");
    await FandomToken.deployed();
    console.log(`Fandom token contract deployed at :- ${FandomToken.address}`);

    // deploy Fandom Market  contract
    const fandomMarket = await hre.ethers.getContractFactory("Market");
    const FandomMarket = await fandomMarket.deploy(FandomToken.address);
    await FandomMarket.deployed();
    console.log(`Fandom  market contract deployed at :- ${FandomMarket.address}`);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
