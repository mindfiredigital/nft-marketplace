const Web3 = require('web3');
const { formatUnits, parseUnits } = require("@ethersproject/units");

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
        const balanceInEth = convertToEther(balanceInWei.toString(), 18);
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
        const price = convertToEther(listingPrice.toString(), 18);
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

export const noExponents = function (num) {
    var data = String(num).split(/[eE]/);
    if (data.length === 1) return data[0];

    var z = '', sign = num < 0 ? '-' : '',
        str = data[0].replace('.', ''),
        mag = Number(data[1]) + 1;

    if (mag < 0) {
        z = sign + '0.';
        while (mag++) z += '0';
        // eslint-disable-next-line no-useless-escape
        return z + str.replace(/^\-/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
}

export const convertToEther = (data, decimals) => {
    if (data == 0)
        return 0;
    decimals = !!decimals ? decimals : 18
    data = noExponents(data);
    return noExponents((formatUnits(data.toString(), decimals)));
}

export const convertToWei = (data, decimals) => {
    decimals = !!decimals ? decimals : 18;
    data = noExponents(data);
    return noExponents((parseUnits(data.toString(), decimals)));
}