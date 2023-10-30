// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @dev contract is used for minting ERC1155 NFT
 */
contract FandomToken is ERC1155URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct NFTInfo {
        uint256 tokenId;
        string tokenURI;
        uint256 amount;
    }

    //mapping user address to user token Ids
    mapping(address => uint256[]) public userTokenId;

    //emits when mint function is called
    event Minted(string uri, uint256 id);
    //emits when a token is transfered
    event Transferred(address from, address to, uint256 id, uint256 amount);

    constructor(string memory baseURI) ERC1155(baseURI) {
        _setBaseURI(baseURI);
    }

    /**
     * @notice mint new NFT
     * @param amount number of token to be minted
     * @param uri NFT token URI
     * @return currentId tokenid
     */
    function mint(uint256 amount, string memory uri) public returns (uint256) {
        _tokenIds.increment();
        uint256 currentId = _tokenIds.current();
        _mint(msg.sender, currentId, amount, "");
        _setURI(currentId, uri);
        userTokenId[msg.sender].push(currentId);
        emit Minted(uri, currentId);

        return currentId;
    }

    /**
     * @notice this function override the initial safetransferfrom function,
     * additionally here some local state update is being done
     * @param from NFT owner address
     * @param to the buyer address
     * @param id id to NFT
     * @param amount no of token to be transfered
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        uint256 tokenCount_ = userTokenId[from].length;
        uint256 lastItem;
        uint256 currentItem;
        for (uint256 i = 0; i < tokenCount_; i++) {
            if (userTokenId[from][i] == id) {
                if (balanceOf(from, id) - amount == 0) {
                    lastItem = userTokenId[from][tokenCount_ - 1];
                    currentItem = userTokenId[from][i];
                    userTokenId[from][i] = lastItem;
                    userTokenId[from][tokenCount_ - 1] = currentItem;
                    userTokenId[from].pop();
                }
            }
        }
        if (balanceOf(to, id) == 0) {
            userTokenId[to].push(id);
        }

        super.safeTransferFrom(from, to, id, amount, data);
        emit Transferred(from, to, id, amount);
    }

    /**
     * @notice this function returns all the nft of user minted in this platform
     * @return list of user token id and uri
     */
    function getUserNFTs() public view returns (NFTInfo[] memory) {
        uint256 userTokenCount_ = userTokenId[msg.sender].length;
        NFTInfo[] memory nfts = new NFTInfo[](userTokenCount_);
        for (uint256 i = 0; i < userTokenCount_; i++) {
            uint256 tokenid_ = userTokenId[msg.sender][i];
            uint256 amount_ = balanceOf(msg.sender, tokenid_);
            string memory uri_ = uri(tokenid_);
            NFTInfo memory nft = NFTInfo(tokenid_, uri_, amount_);
            nfts[i] = nft;
        }
        return nfts;
    }
}
