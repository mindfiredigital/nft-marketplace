import React, { useContext, useEffect, useState } from "react";
import "./Sell.css";
import Detail from "../Detail/Detail";
import NoItem from "../NoItem/NoItem";
import { NATIVE_TOKEN } from "../../utils/messageConstants";
import { MyContext } from "../App/App";
import { getAllNftsOfUser, getListingPrice } from "../../utils/wallet";
import { getNFTDetailsFromURI } from "../../utils/metaDataFormat";
import PriceModal from "../PriceModal/PriceModal";
function Sell() {

  const [showDetail, setshowDetail] = useState(false);
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [nft_data, setnft_data] = useState(null);
  const [listingPrice, setListingPrice] = useState("0.012");
  const [item, setItem] = useState([]);

  /** Importing context API's states to use in the component*/
  const {
    walletConnected, isChainSupported, setIsModalOpen, setModalHeading,
    nftContract, marketplaceContract, setModalDescription, setModalButtonEnabled
  } = useContext(MyContext);

  const fetchAllNftsOfUser = async () => {
    setIsModalOpen(true);
    setModalHeading("Fetching your NFT's");
    setModalDescription("Fetching your NFT's. Please hold on, it may take few seconds");
    setModalButtonEnabled(false);
    const nfts = await getAllNftsOfUser(nftContract, walletConnected);
    if (nfts && nfts.length) {
      let data;
      let itemList = [];
      for (let element of nfts) {
        data = await getNFTDetailsFromURI(element.tokenURI);
        if (data) {
          itemList.push(setNftItem(data, element.tokenId, element.tokenURI, element.amount));
        }
      }
      setItem(itemList);
    } else {
      setItem([]);
    }
    setIsModalOpen(false);
  }

  const setNftItem = (data, nftId, uri, amount) => {
    return {
      image: data.image,
      name: data.name,
      description: data.description,
      nftId: nftId,
      uri: uri,
      amount: amount,
      attributes: data.attributes
    }
  }

  const fetchListingPriceAndSet = async () => {
    const price = await getListingPrice(marketplaceContract)
    if (price) {
      setListingPrice(price);
    } else {
      setListingPrice("0");
    }
  }

  useEffect(() => {
    if (marketplaceContract) {
      fetchListingPriceAndSet();
    } else {
      setListingPrice("0");
    }
  }, [marketplaceContract, listingPrice])

  useEffect(() => {
    if (nftContract && walletConnected) {
      fetchAllNftsOfUser();
    } else {
      setItem([]);
    }

  }, [nftContract, walletConnected]);

  const openPopup = (i) => {
    setshowDetail(true);
    setnft_data(i);
  };

  const openPricePopup = (i) => {
    setShowPricePopup(true);
    setnft_data(i);
  };

  return (
    <div>
      {(walletConnected && isChainSupported) ?
        <div className="listing-price p-4">
          <div className="p-5 listing-price-box">
            <div className="row">
              <div className="col-sm-12">
                <h1 className="text-lg font-black text-center">
                  Put your artistic NFT's on sale just at a fees of
                  <span className="text-[gold] ml-1.5">{listingPrice} {NATIVE_TOKEN}</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        :
        <></>
      }

      {(item.length > 0 && walletConnected && isChainSupported) ?
        <div className="sell-page">
          <div className="sell-container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {item.length > 0 && item.map((i) => {
                return (
                  <div className="max-w-sm rounded overflow-hidden shadow-lg sell-card" key={i.nftId}>
                    <img src={i.image} alt="#" className="w-full" />
                    <div className="px-6 py-4 ">
                      <h5 className="font-bold text-xl mb-2">{i.name}</h5>
                      <p className="text-white-700 text-base">{i.description}</p>
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
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded sell-sc-button"
                        onClick={() => openPricePopup(i)}
                      >
                        Sell
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
          {showPricePopup && (
            <PriceModal setShowPricePopup={setShowPricePopup} nftData={nft_data}
              listPrice={listingPrice} setNftItem={fetchAllNftsOfUser} />
          )}
        </div> :
        <NoItem heading={"No NFT's found"}
          content={"You are not holding any NFT's. Please mint NFT from Mint page to put it on sale!"}
        />}
    </div>

  );
}

export default Sell;
