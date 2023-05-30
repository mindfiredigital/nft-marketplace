const Web3 = require('web3');

export const connectToMetamaskAccount = async () => {
    try {
        const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return address.length ? address[0] : null;
    } catch (error) {
        console.log("Error in connecting with metamask: ", error);
        return null;
    }
}

export const checkIsMetamaskPresent = () => {
    return window.ethereum ? true : false;
}

export const checkIsMetamaskConnected = () => {
    try {
        const accounts = window.ethereum._state.accounts;
        return accounts.length ? accounts[0] : null;
    } catch (error) {
        console.log("Error in checking metamask connected account : ", error);
        return null;
    }
}

export const getChainConnected = async () => {
    try {
        const chain = await window.ethereum.request({ method: 'eth_chainId' });
        return chain ? chain : null;
    } catch (error) {
        console.log("Error in fetching chain id from metamask : ", error);
        return null;
    }
}

export const connectToWeb3 = (provider) => {
    try {
        return new Web3(provider);
    } catch (error) {
        console.log("Error connecting to web3 library : ", error);
        return null;
    }
}

export const getWalletBalance = async (address) => {
    try {
        const balanceInHex = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest']
        });
        const balanceInWei = parseInt(balanceInHex, 16);
        const balanceInEth = Web3.utils.fromWei(balanceInWei.toString(), 'ether');
        return balanceInEth;
    } catch (error) {
        console.log("Error in fetching wallet balance: ", error);
        return 0;
    }
}

export const getAllNftsOfUser = async (contract, account) => {
    try {
        return await contract.methods.getUserNFTs().call({
            from: account
        });
    } catch (error) {
        console.log("Error in fetching user NFT's : ", error);
        return null;
    }
}

export const getListingPrice = async (contract) => {
    try {
        const listingPrice = await contract.methods.listingPrice().call();
        const price = Web3.utils.fromWei(listingPrice.toString(), 'ether');
        return price;
    } catch (error) {
        console.log("Error in fetching listing price : ", error);
        return null;
    }
}

export const getAllUnsoldNfts = async (contract) => {
    try {
        return await contract.methods.fetchMarketItems().call();
    } catch (error) {
        console.log("Error in fetching all unsold NFT's : ", error);
        return null;
    }
}

// put item on sale : createMarketItem payable

// buy item : buy