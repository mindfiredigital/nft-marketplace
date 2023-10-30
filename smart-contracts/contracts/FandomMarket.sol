// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

import "./FandomToken.sol";

/**
 * @dev Implementation of NFT MarketPlace where a user can list,sell and buy NFT.
 */
contract Market is Ownable, ERC1155Receiver {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address private immutable _nftAddress;

    //Stores the listing price
    uint256 public listingPrice;

    struct MarketItem {
        uint256 itemId;
        uint256 tokenId;
        address payable seller;
        address payable buyer;
        uint256 units;
        uint256 price;
        uint256 listedTimestamp;
        uint256 soldTimestamp;
        bool sold;
    }

    struct MarketItemDetail {
        uint256 itemId;
        uint256 tokenId;
        uint256 price;
        string uri;
        uint256 amountListed;
        address payable seller;
    }

    //mapping from item ID to marketItem
    mapping(uint256 => MarketItem) public idToMarketItem;
    //mapping user address to marketItem
    mapping(address=>MarketItemDetail[]) public userNFTs;

    //emits event when createMarketItem function is called
    event MarketItemCreated(
        uint256 indexed itemId,
        uint256 indexed tokenId,
        address indexed owner,
        uint256 price,
        uint256 amountListed
    );

    //emits event when buy function is called
    event NFTSold(
        uint256 indexed itemId,
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price,
        uint256 amount
    );

    //emits event when buy function is called
    event ListingPriceChanges(uint256 indexed price, address indexed user);

    /**
     * @notice Deployer will be the owner of the contract
     */
    constructor(address nftAddress) {
        require(nftAddress != address(0), "Invalid address");
        _nftAddress = nftAddress;
        listingPrice = 25 * (10 ** 14);
    }

    /**
     * @notice Returns the listing price to list the NFT
     */
    function setListingPrice(
        uint256 listingPrices
    ) external onlyOwner returns (uint256) {
        listingPrice = listingPrices;
        emit ListingPriceChanges(listingPrice, msg.sender);
        return listingPrice;
    }

    /**
     * @notice  this function returns the eth balance of contract
     */
    function getBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice this function used to send eth from the contract
     */
    function transferEth(
        address payable recipient,
        uint256 amount
    ) external onlyOwner {
        require(recipient != address(0), "Invalid address");
        (bool sent, ) = recipient.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external pure override returns (bytes4) {
        // Your code here
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external pure override returns (bytes4) {
        // Your code here
        return this.onERC1155Received.selector;
    }

    /**
     * @notice this function used for removing user nft
     * @param userAddr user address
     * @param itemId itemId 
     */
     function removeNFT(address userAddr, uint256 itemId) internal  {
        MarketItemDetail[] storage userNFT = userNFTs[userAddr];
        uint256 userNFTLen = userNFT.length;

        MarketItemDetail memory lastNFT = userNFT[userNFTLen - 1];
        MarketItemDetail memory currNFT;

        for (uint256 i = 0; i < userNFTLen; i++) {
            if (userNFT[i].itemId == itemId) {
                currNFT = userNFT[i];
                userNFT[i] = lastNFT;
                userNFT.pop();
                break;
            }
        }
    }

    /**
     * @notice List the NFT to the NFT Marketplace
     * @param tokenId token id
     * @param price  NFT price
     * @param amount , no of NFT to be listed
     */
    function createMarketItem(
        uint256 tokenId,
        uint256 price,
        uint256 amount
    ) external payable {
        require(
            FandomToken(_nftAddress).balanceOf(msg.sender, tokenId) >= amount,
            "You don't have sufficient token to list"
        );
    
        require(msg.value >= listingPrice, "Amount is less than listing price");
        require(price > 0, "Price must be at least 1 wei");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        FandomToken fandomToken = FandomToken(_nftAddress);

        MarketItem memory item = MarketItem(
            itemId,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            amount,
            price,
            block.timestamp,
            0,
            false
        );

        MarketItemDetail memory nftDetails = MarketItemDetail(
            itemId,
            tokenId,
            price,
            fandomToken.uri(tokenId),
            amount,
            payable(msg.sender)
        );

        idToMarketItem[itemId] =  item;
        userNFTs[msg.sender].push(nftDetails);

        //on listing the NFT in marketplace it's ownership will be transfered to the  contract
        FandomToken(_nftAddress).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            amount,
            "0x00"
        );
        emit MarketItemCreated(itemId, tokenId, msg.sender, price, amount);
    }

    /**
     * @notice user can buy token
     * @param itemId token id
     */
    function buy(uint256 itemId) external payable {
        require(!(idToMarketItem[itemId].sold), "Item already sold");
        require(address(idToMarketItem[itemId].seller) != msg.sender, "Owner cannot buy own NFT");
        uint256 price = idToMarketItem[itemId].price;
        require(uint256(msg.value) >= price, "amount not equal to price");
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        uint256 amount = idToMarketItem[itemId].units;

        idToMarketItem[itemId].sold = true;
        idToMarketItem[itemId].soldTimestamp = block.timestamp;
        _itemsSold.increment();

        FandomToken(_nftAddress).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId,
            amount,
            "0x00"
        );
        removeNFT(address(idToMarketItem[itemId].seller),itemId);
        emit NFTSold(itemId, tokenId, msg.sender, price, amount);
        idToMarketItem[itemId].seller.transfer(msg.value);
    }

    /**
     * @notice Returns all unsold NFT
     */
    function fetchMarketItems()
        external
        view
        returns (MarketItemDetail[] memory)
    {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = itemCount - _itemsSold.current();
        uint256 currentIndex = 0;
        uint256 currentId;
        MarketItem storage currentItem;
        MarketItemDetail memory itemDetail;
        FandomToken fandomToken = FandomToken(_nftAddress);

        MarketItemDetail[] memory items = new MarketItemDetail[](
            unsoldItemCount
        );
        for (uint256 i = 0; i < itemCount; i++) {
            currentId = i + 1;

            if (!idToMarketItem[currentId].sold) {
                currentItem = idToMarketItem[currentId];

                itemDetail = MarketItemDetail(
                    currentItem.itemId,
                    currentItem.tokenId,
                    currentItem.price,
                    fandomToken.uri(currentItem.tokenId),
                    currentItem.units,
                    currentItem.seller
                );
                items[currentIndex] = itemDetail;
                currentIndex += 1;
            }
        }
        return items;
    }

    /**
     *@notice this function returns users NFT 
     */
     function fetchMyNfts() external
        view
        returns (MarketItemDetail[] memory){
            return userNFTs[msg.sender];
        }

    /**
     * @notice this function is used for unlist a NFT from the market place
     * @param itemId id of the NFT in the marketplace
     */
    function unlistItem(uint256 itemId) external {
        MarketItem memory item = idToMarketItem[itemId];
        address seller = item.seller;
        require(
            seller == msg.sender,
            "caller is not the owner"
        );
        uint256 amount = item.units;
        idToMarketItem[itemId].sold=true;
        FandomToken(_nftAddress).safeTransferFrom(
            address(this),
            item.seller,
            item.tokenId,
            amount,
            "0x00"
        );
        removeNFT(seller,itemId);

    }
}
