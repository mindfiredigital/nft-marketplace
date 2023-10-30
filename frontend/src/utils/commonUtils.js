export const supportedChains = {
    "0x13881": "Mumbai Matic",
    "0xaa36a7": "Sepolia",
    "0xa869": "Avalanche Fuji"
};

export const chainProperties = {
    "0x13881": {
        chain: "Mumbai Matic",
        currency: "MATIC",
        nftAddress: "0x2D0426A1B870F1f72A321F529E1154CE78c6f4B3",
        marketplaceAddress: "0xF0dF57b57B2B9F911e2d4e16F842874cF390847a",
        explorerUrl: "https://mumbai.polygonscan.com/tx/"
    },
    "0xaa36a7": {
        chain: "Sepolia",
        currency: "ETH",
        nftAddress: "0xbA6De6117C661D3BBa39c9E0Ee83763B80E9cEf4",
        marketplaceAddress: "0xB22141236071EFf920f6b8bfC221C2C2AF776C92",
        explorerUrl: "https://sepolia.etherscan.io/tx/"
    },
    "0xa869": {
        chain: "Avalanche Fuji",
        currency: "AVAX",
        nftAddress: "0xFb85190704f0ca44F0a5f447EFF6cba49AB23B2B",
        marketplaceAddress: "0xC0a57943372B34D10e09AA7E539Ee3BA5d7BD6C2",
        explorerUrl: "https://testnet.snowtrace.io/tx/"
    }
}

export const PINATA_GATEWAY_BASE_URL = "https://harlequin-major-urial-890.mypinata.cloud/ipfs/";

export const PINATA_JSON_UPLOAD_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

export const PINATA_FILE_UPLOAD_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

export const ALLOWED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "gif"];

export const REGEX_FOR_PRICE = /^(?:\d{0,5}\.\d{1,5})$|^\d{0,5}$/;
