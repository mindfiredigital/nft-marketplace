import { supportedChains } from "./commonUtils";
const { ethers } = require("ethers");

// update address in context API
export const connectToMetamask = async () => {
    try {
        const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log("Address connected : ", address[0])
        return address.length ? address[0] : null;
    } catch (error) {
        console.log("Error in connecting with metamask: ", error);
        // error.message -> show this in popup
        return null;
    }
}

// update balance in context API
export const getWalletBalance = async (address) => {
    try {
        const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [address, 'latest']
        });
        // convert from hex to number and then in ETH
        console.log("balance : ", balance)
    } catch (error) {
        console.log("Error in fetching wallet balance: ", error);
        return null;
    }
}

export const checkIsMetamaskPresent = () => {
    if (window.ethereum)
        return true;
    else
        // show popup error
        return false;
}

export const checkIsMetamaskConnected = () => {
    const accounts = window.ethereum._state.accounts;
    return accounts.length ? accounts[0] : null;
}

export const connectToEthersLibrary = (provider) => {
    try {
        return new ethers.providers.Web3Provider(provider);
    } catch (error) {
        console.log("Error connecting to ether.js : ", error);
        return null;
    }
}

// update account address in context API
window.ethereum.on('accountsChanged', function (accounts) {
    console.log("account changed : ", accounts[0]);
    // reload the page with new details
});

// update context API for is chain supported
window.ethereum.on('chainChanged', (chain) => {
    if (!supportedChains[chain]) {
        console.log("unsupported chain");
        // show popup error that please connect to Mumbai Matic only
        return false;
    } else {
        // reload the page with new details
        return true;
    }
});

// Handle both connect to wallet button page functionality
// handle account change event
// handle disconnect event
// setup ether.js code
// handle chain change event
// 
