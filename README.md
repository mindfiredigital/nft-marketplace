# Fandom-NFT-Marketplace-Frontend

Fandom is a multi-chain platform for fans to connect with their favorite celebrities and collect exclusive digital memorabilia.  This is a multi-chain platform for creators, collectors, and enthusiasts to buy, sell, and discover unique and valuable digital collectibles known as Non-Fungible Tokens (NFTs).
Fans can discover, collect, and engage with exclusive NFTs from their most cherished celebrities.

## Features
The NFT Marketplace provides a range of features to enhance your experience :-

- Browse and discover a diverse collection of NFTs from various categories.
- Wallet integration to securely store and manage your digital assets.
- Buy NFTs directly from artists and collectors.
- Sell your own NFTs to interested buyers.
- Detailed NFT profiles with descriptions, images, and transaction history.

  #### Mint NFT

  - Connect your Metamask wallet
  - Navigate to "Mint" section
  - Upload the image
  - Fill NFt attribute details
  - Click on "Mint NFT" button

  #### Sell NFT

  - Connect your Metamask wallet
  - Navigate to "Sell" section
  - You can see the list of NFT you have
  - Click on "Sell" button
  - Put the price of the NFT
  - Click on "Confirm"

  #### Buy NFT

  - Connect your Metamask wallet
  - Navigate to "Buy" section
  - You can see the list of NFT available for sell
  - Click on "Buy" button

## System Diagram

![System Diagram](./frontend/docs/system-diagram.png)

## Sequence diagram to mint NFT

![Mint Sequence Diagram](./frontend/docs/mint.png)

## Sequence diagram to sell NFT

![Sell Sequence Diagram](./frontend/docs/sell.png)

## Sequence diagram to buy NFT

![Buy Sequence Diagram](./frontend/docs/buy.png)

## Smart Contract Details
S. No. | Smart Contract | Chain | Contract Address |
--- | --- | --- | --- |
1 | Fandom NFT | Mumbai Matic | <a href="https://mumbai.polygonscan.com/address/0x7AA0768e2f046a351b24AC00CE43CA8d2BCbc968" target="_blank">https://mumbai.polygonscan.com/address/0x7AA0768e2f046a351b24AC00CE43CA8d2BCbc968</a> |
2 | NFT Marketplace | Mumbai Matic | <a href="https://mumbai.polygonscan.com/address/0xa1AB3cE05b0Ae95D8e5e7CB09Df315A3d4820d13" target="_blank">https://mumbai.polygonscan.com/address/0xa1AB3cE05b0Ae95D8e5e7CB09Df315A3d4820d13</a> |
3 | Fandom NFT | Sepolia | <a href="https://sepolia.etherscan.io/address/0x740b9A44545367F97f6840dCb8F0c882A79687B4" target="_blank">https://sepolia.etherscan.io/address/0x740b9A44545367F97f6840dCb8F0c882A79687B4</a> |
4 | NFT Marketplace | Sepolia | <a href="https://sepolia.etherscan.io/address/0xA5E49fc6555b0A7f9FAe5a1400D7e5Afd20E1dE3" target="_blank">https://sepolia.etherscan.io/address/0xA5E49fc6555b0A7f9FAe5a1400D7e5Afd20E1dE3</a> |
5 | Fandom NFT | Avalanche Fuji | <a href="https://testnet.snowtrace.io/address/0x740b9A44545367F97f6840dCb8F0c882A79687B4" target="_blank">https://testnet.snowtrace.io/address/0x740b9A44545367F97f6840dCb8F0c882A79687B4</a> |
6 | NFT Marketplace | Avalanche Fuji | <a href="https://testnet.snowtrace.io/address/0xA5E49fc6555b0A7f9FAe5a1400D7e5Afd20E1dE3" target="_blank">https://testnet.snowtrace.io/address/0xA5E49fc6555b0A7f9FAe5a1400D7e5Afd20E1dE3</a> |
6 | Fandom NFT | Hedera | <a href="https://hashscan.io/testnet/contract/0.0.1748907" target="_blank">https://hashscan.io/testnet/contract/0.0.1748907</a> |
7 | NFT Marketplace | Hedera | <a href="https://hashscan.io/testnet/contract/0.0.1749094" target="_blank">https://hashscan.io/testnet/contract/0.0.1749094</a> |

## Demo

<a href="https://fandom-nft-marketplace-v2.netlify.app/" target="_blank">https://fandom-nft-marketplace-v2.netlify.app/</a> 

## Setup

- Clone the repo:- `git clone https://gitlab.mindfire.co.in/bhupeshd/fandom-nft-marketplace-frontend.git`
- Create a .env file and take reference from .env.sample file to fill it
- Install NPM packages `npm install`
- Run to start your project  `npm start`
- Open this url on browser `http://localhost:3000/`