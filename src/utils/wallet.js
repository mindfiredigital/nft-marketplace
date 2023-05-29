const { ethers, formatEther } = require("ethers");

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

export const connectToEthersLibrary = (provider) => {
    try {
        return new ethers.BrowserProvider(provider)
    } catch (error) {
        console.log("Error connecting to ether library : ", error);
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
        const balanceInEth = formatEther(balanceInWei.toString());
        return balanceInEth;
    } catch (error) {
        console.log("Error in fetching wallet balance: ", error);
        return 0;
    }
}