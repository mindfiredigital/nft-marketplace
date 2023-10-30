const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

describe("Fandom NFT Marketplace test : ", async () => {
  let fandomToken;
  let fandomMarket;

  before(async () => {
    [firstUser, secondUser, thirdUser] = await ethers.getSigners();
    console.log(`Deploying contracts with the account :- ${firstUser.address}`);
  });

  // ----------------------------- Deploying contracts -----------------------------------

  it("Should deploy Fandom token contract", async function () {
    const FandomToken = await ethers.getContractFactory("FandomToken");
    fandomToken = await FandomToken.deploy("https://xyz.com/");
    await fandomToken.deployed();
    console.log(`Fandom token contract deployed at :- ${fandomToken.address}`);
  });

  it("Should deploy Fandom market contract", async function () {
    const FandomMarket = await ethers.getContractFactory("Market");
    fandomMarket = await FandomMarket.deploy(fandomToken.address);
    await fandomMarket.deployed();
    console.log(`WETH token contract deployed at :- ${fandomMarket.address}`);
  });

  // ----------------------------- Test functionalities -----------------------------------

  it("Should mint a fandom NFT", async function () {
    const result = await fandomToken.mint(20, "123");
    const receipt = await result.wait();
    const events = receipt.events?.filter((x) => {
      return x.event == "Minted";
    });
    //console.log("events",events);
    expect(events[0].event).to.be.equal("Minted");
  });

  it("Should give approval to market", async function () {
    const result = await fandomToken.setApprovalForAll(
      fandomMarket.address,
      true
    );
    await result.wait();
    const approved = await fandomToken.isApprovedForAll(
      firstUser.address,
      fandomMarket.address
    );
    expect(approved).to.be.equal(true);
  });

  it("Should list the NFT in market", async function () {
    const amount = 25 * 10 ** 14;
    const result = await fandomMarket.createMarketItem(1, 1000, 10, {
      value: amount,
    });
    const receipt = await result.wait();
    const events = receipt.events?.filter((x) => {
      return x.event == "MarketItemCreated";
    });
    expect(events[0].args.tokenId).to.be.equal(1);
  });
  it("Should list the unsold NFT in market", async function () {
    const result = await fandomMarket.connect(thirdUser).fetchMarketItems();
    expect(Number(result[0].tokenId)).to.be.equal(1);
  });

  it("This function used for buy NFT from market", async function () {
    const result = await fandomMarket.connect(secondUser).buy(1, {
      value: 1000,
    });
    await result.wait();
    const balance = await fandomToken.balanceOf(secondUser.address, 1);
    expect(balance).to.be.equal(10);
  });

  it("This test is used for unlisting NFT from market", async function () {
    //Mint NFT
    const result = await fandomToken.mint(10, "1234");
    let receipt = await result.wait();
    let events = receipt.events?.filter((x) => {
      return x.event == "Minted";
    });
    //set approval

    const tokenId = events[0].args.id;
    const result2 = await fandomToken.setApprovalForAll(
      fandomMarket.address,
      true
    );
    //create market item
    const amount = 25 * 10 ** 14;

    const result3 = await fandomMarket.createMarketItem(tokenId, 1000, 10, {
      value: amount,
    });
    const rec = await result3.wait();
    events = rec.events?.filter((x) => {
      return x.event == "MarketItemCreated";
    });
    const itemId = events[0].args.itemId;

    //check user balanca
    const balaceBefore = await fandomToken.balanceOf(
      firstUser.address,
      tokenId
    );

    const result4 = await fandomMarket.unlistItem(itemId);
    const balaceAfter = await fandomToken.balanceOf(firstUser.address, tokenId);
    expect(balaceBefore + 10).to.be.equal(balaceAfter);
  });

  it("Should set the listing price", async function () {
    const amount = 100000000000000000n;
    const result = await fandomMarket
      .connect(firstUser)
      .setListingPrice(amount);
    await result.wait();
    const newlistingOrice = await fandomMarket.listingPrice();
    expect(amount).to.be.equal(newlistingOrice);
  });

  it("Should list user NFT", async function () {
    const result = await fandomToken.connect(firstUser).getUserNFTs();
    expect(result[1].tokenURI).to.be.equal("https://xyz.com/1234");
  });
});
