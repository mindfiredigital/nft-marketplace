import "./Buy.css";
import NoItem from "../NoItem/NoItem";
import { MyContext } from "../App/App";
import { useContext, useEffect, useState } from "react";
import { convertToEther, convertToWei, getAllUnsoldNfts, getWalletBalance } from "../../utils/wallet";
import { getNFTDetailsFromURI } from "../../utils/metaDataFormat";
import Detail from "../Detail/Detail";
import { SUCCESSFUL_TRANSACTION, TRANSACTION_HASH } from "../../utils/messageConstants";

function Buy() {

  const [showDetail, setshowDetail] = useState(false);
  const [nft_data, setnft_data] = useState(null);
  const [item, setItem] = useState([]);

  /** Importing context API's states to use in the component*/
  const {
    web3, walletConnected, isChainSupported, setIsModalOpen, setModalHeading,
    nftContract, marketplaceContract, setModalDescription, setModalButtonEnabled,
    setWalletEthBalance, walletEthBalance, chainConfig
  } = useContext(MyContext);

  const fetchAllNftsOnSale = async () => {

    setIsModalOpen(true);
    setModalHeading("Fetching NFT's on Sale");
    setModalDescription("Fetching all the NFT's that are on sale. Please hold on, it may take few seconds");
    setModalButtonEnabled(false);

    const nfts = await getAllUnsoldNfts(marketplaceContract);

    if (nfts && nfts.length) {

      let data;
      let itemList = [];

      if (nfts && nfts.length) {
        for (let element of nfts) {
          // Remove the NFT's whose owner is current connected account
          if ((element.seller).toLowerCase() != (walletConnected).toLowerCase()) {
            data = await getNFTDetailsFromURI(element.uri);
            if (data) {
              itemList.push(setNftItem(data, element));
            }
          }
          setItem(itemList);
          console.log("item list: ", itemList);
        }
      } else {
        setItem([]);
      }

      setIsModalOpen(false);
    } else {
      setItem([]);
    }
    setIsModalOpen(false);

  }

  const setNftItem = (data, element) => {
    return {
      image: data.image,
      name: data.name,
      description: data.description,
      nftId: element.tokenId,
      uri: element.uri,
      amount: element.units,
      attributes: data.attributes,
      itemId: element.itemId,
      price: convertToEther(element.price, 18)
    }
  }

  /** Handles confirmation of user for buying NFT */
  const buy = async (selectedNft) => {

    setIsModalOpen(true);
    setModalHeading("Buy Transaction");
    setModalDescription("Your buy transacion is in progress, Please wait as it can take some time to complete due to heavy traffic on network!")
    setModalButtonEnabled(false);

    const priceInWei = convertToWei(selectedNft.price.toString(), 18);
    const itemId = selectedNft.itemId;

    const check = await checkUserHasSufficientBalanceForTx(itemId, priceInWei);

    if (!check.status) {
      setModalHeading("Buy Transaction Failed");
      setModalDescription(`Transaction failed because your account doesn't have sufficient balance to pay ${nft_data.price} ${chainConfig.currency} and gas fees!`);
      setModalButtonEnabled(true);
      setIsModalOpen(true);
      return;
    }

    await buyTransaction(itemId, priceInWei, check.gas);

  };

  /** Checks user has sufficient balance to put NFT on sale or not */
  const checkUserHasSufficientBalanceForTx = async (itemId, priceInWei) => {

    try {

      const gasLimit = await marketplaceContract.methods.buy(itemId)
        .estimateGas({ from: walletConnected, value: priceInWei });

      const bufferedGasLimit = Math.round(
        Number(gasLimit) + (Number(gasLimit) * Number(0.2))
      );

      const currentGasPrice = await web3.eth.getGasPrice();
      const txFee = (Number(currentGasPrice) * bufferedGasLimit) + Number(priceInWei);
      const feeInEth = convertToEther(txFee.toString(), 18);

      if (Number(walletEthBalance) < Number(feeInEth)) {
        return { gas: bufferedGasLimit, status: false };
      } else {
        return { gas: bufferedGasLimit, status: true };
      }

    } catch (error) {
      console.log("Error in estimating transaction fee : ", error);
      return { gas: 0, status: false };
    }

  }

  /** Execute NFT buy function in NFT marketplace smart contract */
  const buyTransaction = async (itemId, priceInWei, gas) => {
    try {

      let url = "";

      await marketplaceContract.methods.buy(itemId)
        .send({
          from: walletConnected,
          gasLimit: gas,
          value: priceInWei
        })
        .on("transactionHash", (hash) => {
          url = chainConfig.explorerUrl + hash;
          setModalDescription(`${TRANSACTION_HASH} <a class="text-indigo-500" target="_blank" href="${url}">${url}</a>`);
        })
        .on("receipt", async () => {
          setModalDescription(`${SUCCESSFUL_TRANSACTION} <a class="text-indigo-500" target="_blank" href="${url}">${url}</a>`);
          setWalletEthBalance(await getWalletBalance(walletConnected));
          await fetchAllNftsOnSale();
          setModalButtonEnabled(true);
        })
        .on("error", async (error) => {
          setModalHeading("Buy Transaction Failed");
          setModalDescription(`Failed to buy NFT. ${error.message}`);
          setModalButtonEnabled(true);
          setWalletEthBalance(await getWalletBalance(walletConnected));
        })

    } catch (error) {
      console.log("Error in buy transaction : ", error);
      setModalHeading("Buy Transaction Failed");
      setModalDescription(`Failed to buy NFT. ${error.message}`);
      setModalButtonEnabled(true);
    }
  }

  const openPopup = (i) => {
    setshowDetail(true);
    setnft_data(i);
  };

  useEffect(() => {
    if (nftContract && walletConnected && marketplaceContract) {
      fetchAllNftsOnSale();
    } else {
      setItem([]);
    }

  }, [nftContract, marketplaceContract, walletConnected, chainConfig]);

  return (
    <div>
      {(item.length > 0 && walletConnected && isChainSupported) ? (
        <div className="buy-page">
          <div className="buy-container mx-auto px-4 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 p-12">
              {item.length > 0 &&
                item.map((i) => {
                  return (
                    <div className="max-w-sm rounded overflow-hidden shadow-lg buy-card" key={i.nftId}>
                      <img src={i.image} alt="#" className="w-full" />
                      <div className="px-6 py-4 ">
                        <h5 className="font-bold text-xl mb-2">{i.name}</h5>
                        <p className="text-white-700 text-base">
                          {i.description}
                        </p>
                        <p className="text-[gold] font-extrabold text-base">
                          Price: {i.price} {chainConfig ? chainConfig.currency : ""}
                        </p>
                        <span className="icon">
                          <a
                            className="text-[#0000EE] underline cursor-pointer text-sm"
                            onClick={() => openPopup(i)}
                          >
                            more details
                          </a>
                        </span>
                      </div>
                      <div className="px-6 pb-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded buy-sc-button"
                          onClick={() => buy(i)}
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          {showDetail && (
            <Detail setshowDetail={setshowDetail} nft_data={nft_data} />
          )}
        </div>
      ) : (
        <NoItem heading={"No NFT's found for sell"}
          content={"There is no NFT available right not for sale that you can purchase. Please hold on for some one to put NFT's on sale!"}
        />
      )}
    </div>
  );
}

export default Buy;
