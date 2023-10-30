export const supportedChains = {
  '0x13881': 'Mumbai Matic',
  '0xaa36a7': 'Sepolia',
  '0xa869': 'Avalanche Fuji',
  '0x128': 'Hedera',
}

export const chainProperties = {
  '0x13881': {
    chain: 'Mumbai Matic',
    currency: 'MATIC',
    nftAddress: '0x7AA0768e2f046a351b24AC00CE43CA8d2BCbc968',
    marketplaceAddress: '0xa1AB3cE05b0Ae95D8e5e7CB09Df315A3d4820d13',
    explorerUrl: 'https://mumbai.polygonscan.com/tx/',
    decimal: 18,
  },
  '0xaa36a7': {
    chain: 'Sepolia',
    currency: 'ETH',
    nftAddress: '0x740b9A44545367F97f6840dCb8F0c882A79687B4',
    marketplaceAddress: '0xA5E49fc6555b0A7f9FAe5a1400D7e5Afd20E1dE3',
    explorerUrl: 'https://sepolia.etherscan.io/tx/',
    decimal: 18,
  },
  '0xa869': {
    chain: 'Avalanche Fuji',
    currency: 'AVAX',
    nftAddress: '0x740b9A44545367F97f6840dCb8F0c882A79687B4',
    marketplaceAddress: '0xA5E49fc6555b0A7f9FAe5a1400D7e5Afd20E1dE3',
    explorerUrl: 'https://testnet.snowtrace.io/tx/',
    decimal: 18,
  },
  '0x128': {
    chain: 'Hedera',
    currency: 'HBAR',
    nftAddress: '0x837e3146Ef1172254fa985ADCE891d50459A41B9',
    marketplaceAddress: '0x78fB6373a7fFB573dC50392d9eCa4b46bF3F7Ef7',
    explorerUrl: 'https://hashscan.io/testnet/transactions',
    decimal: 8,
  },
}

export const PINATA_GATEWAY_BASE_URL =
  'https://orange-scrawny-amphibian-531.mypinata.cloud/ipfs/'

export const PINATA_JSON_UPLOAD_URL =
  'https://api.pinata.cloud/pinning/pinJSONToIPFS'

export const PINATA_FILE_UPLOAD_URL =
  'https://api.pinata.cloud/pinning/pinFileToIPFS'

export const ALLOWED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif']

export const REGEX_FOR_PRICE = /^(?:\d{0,5}\.\d{1,5})$|^\d{0,5}$/
