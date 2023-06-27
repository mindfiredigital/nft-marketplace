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

![System Diagram](./docs/system-diagram.png)

## Sequence diagram to mint NFT

![Mint Sequence Diagram](./docs/mint.png)

## Sequence diagram to sell NFT

![Sell Sequence Diagram](./docs/sell.png)

## Sequence diagram to buy NFT

![Buy Sequence Diagram](./docs/buy.png)

## Smart Contract Details
S. No. | Smart Contract | Chain | Contract Address |
--- | --- | --- | --- |
1 | Fandom NFT | Mumbai Matic | <a href="https://mumbai.polygonscan.com/address/0x2D0426A1B870F1f72A321F529E1154CE78c6f4B3" target="_blank">https://mumbai.polygonscan.com/address/0x2D0426A1B870F1f72A321F529E1154CE78c6f4B3</a> |
2 | NFT Marketplace | Mumbai Matic | <a href="https://mumbai.polygonscan.com/address/0xF0dF57b57B2B9F911e2d4e16F842874cF390847a" target="_blank">https://mumbai.polygonscan.com/address/0xF0dF57b57B2B9F911e2d4e16F842874cF390847a</a> |
3 | Fandom NFT | Sepolia | <a href="https://sepolia.etherscan.io/address/0xbA6De6117C661D3BBa39c9E0Ee83763B80E9cEf4" target="_blank">https://sepolia.etherscan.io/address/0xbA6De6117C661D3BBa39c9E0Ee83763B80E9cEf4</a> |
4 | NFT Marketplace | Sepolia | <a href="https://sepolia.etherscan.io/address/0xB22141236071EFf920f6b8bfC221C2C2AF776C92" target="_blank">https://sepolia.etherscan.io/address/0xB22141236071EFf920f6b8bfC221C2C2AF776C92</a> |
5 | Fandom NFT | Avalanche Fuji | <a href="https://testnet.snowtrace.io/address/0xFb85190704f0ca44F0a5f447EFF6cba49AB23B2B" target="_blank">https://testnet.snowtrace.io/address/0xFb85190704f0ca44F0a5f447EFF6cba49AB23B2B</a> |
6 | NFT Marketplace | Avalanche Fuji | <a href="https://testnet.snowtrace.io/address/0xC0a57943372B34D10e09AA7E539Ee3BA5d7BD6C2" target="_blank">https://testnet.snowtrace.io/address/0xC0a57943372B34D10e09AA7E539Ee3BA5d7BD6C2</a> |

## Demo

<a href="https://64996021df9c3f1f20a94473--super-nasturtium-36743b.netlify.app/" target="_blank">https://64996021df9c3f1f20a94473--super-nasturtium-36743b.netlify.app/</a> 

## Setup

- Clone the repo:- `git clone https://gitlab.mindfire.co.in/bhupeshd/fandom-nft-marketplace-frontend.git`
- Create a .env file and take reference from .env.sample file to fill it
- Install NPM packages `npm install`
- Run to start your project  `npm start`
- Open this url on browser `http://localhost:3000/`