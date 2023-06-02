import { useState, useContext, useEffect } from "react";
import "./Dashboard.css";
import Detail from "../NFT_Detail/Detail";
import NoItem from "../NoItem/NoItem";
import { MyContext } from "../App/App";
import {
  getAllNftsOfUser,
  getAllListedNftsOfUser,
  convertToEther,
} from "../../utils/wallet";
import { getNFTDetailsFromURI } from "../../utils/metaDataFormat";

function Dashboard() {

  const [showDetail, setshowDetail] = useState(false);
  const [nft_data, setnft_data] = useState(null);
  const [item, setItem] = useState([]);
  const [sellItem, setSellItem] = useState([]);

  /** Importing context API's states to use in the component*/
  const {
    walletConnected,
    isChainSupported,
    setIsModalOpen,
    setModalHeading,
    nftContract,
    marketplaceContract,
    setModalDescription,
    setModalButtonEnabled,
  } = useContext(MyContext);

  const fetchAllNftsOfUser = async () => {

    setIsModalOpen(true);
    setModalHeading("Fetching your NFT's");
    setModalDescription(
      "Fetching your NFT's. Please hold on, it may take few seconds"
    );
    setModalButtonEnabled(false);

    const nfts = await getAllNftsOfUser(nftContract, walletConnected);

    if (nfts && nfts.length) {
      let data;
      let itemList = [];
      for (let element of nfts) {
        data = await getNFTDetailsFromURI(element.tokenURI);
        if (data) {
          itemList.push(
            setNftItem(data, element.tokenId, element.tokenURI, element.amount)
          );
        }
      }
      setItem(itemList);
    } else {
      setItem([]);
    }
    setIsModalOpen(false);
  };

  const fetchListedNftsOfUser = async () => {

    setIsModalOpen(true);
    setModalHeading("Fetching your NFT's");
    setModalDescription(
      "Fetching your NFT's. Please hold on, it may take few seconds"
    );
    setModalButtonEnabled(false);

    const nfts = await getAllListedNftsOfUser(
      marketplaceContract,
      walletConnected
    );

    if (nfts && nfts.length) {
      let data;
      let itemList = [];
      for (let element of nfts) {
        data = await getNFTDetailsFromURI(element.uri);
        if (data) {
          itemList.push(
            setSellNftItem(
              data,
              element.tokenId,
              element.uri,
              element.amountListed,
              element.price
            )
          );
        }
      }
      setSellItem(itemList);
    } else {
      setSellItem([]);
    }
    setIsModalOpen(false);
  };

  const setNftItem = (data, nftId, uri, amount) => {
    return {
      image: data.image,
      name: data.name,
      description: data.description,
      nftId: nftId,
      uri: uri,
      amount: amount,
      attributes: data.attributes,
    };
  };

  //On sale NFT Detail
  const setSellNftItem = (data, nftId, uri, amount, price) => {
    return {
      image: data.image,
      name: data.name,
      description: data.description,
      nftId: nftId,
      uri: uri,
      amount: amount,
      attributes: data.attributes,
      price: convertToEther(price, 18),
    };
  };

  useEffect(() => {
    if (nftContract && walletConnected) {
      fetchAllNftsOfUser();
    } else {
      setItem([]);
    }
  }, [nftContract, walletConnected]);

  useEffect(() => {
    if (marketplaceContract && walletConnected) {
      fetchListedNftsOfUser();
    } else {
      setSellItem([]);
    }
  }, [marketplaceContract, walletConnected]);

  const openPopup = (i) => {
    setshowDetail(true);
    setnft_data(i);
  };
  
  return (
    <div className="dashboard-create-item-containers">
      {item.length > 0 && isChainSupported && walletConnected && (
        <div className="w-full">
          <div className="dashboard-h">
            <h3>My Collection</h3>
          </div>
          <div className="flex flex-wrap items-center my-[25px] justify-center">
            {item.length > 0 &&
              item.map((i) => {
                return (
                  <div className="max-w-sm rounded overflow-hidden shadow-lg dashboard-card">
                    <img src={i.image} alt="#" className="w-full img" />
                    <div className="px-6 py-4 ">
                      <h5 className="font-bold text-xl mb-2">{i.name}</h5>
                      <p className="text-white-700 text-base">
                        {i.description}
                      </p>
                    </div>
                    <div className="px-6 pb-4">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded dashboard-sc-button"
                        onClick={() => openPopup(i)}
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {sellItem.length > 0 && isChainSupported && walletConnected && (
        <div className="w-full">
          <div className="dashboard-h">
            <h3>My NFT's on Sale</h3>
          </div>
          <div className="flex flex-wrap items-center my-[25px] justify-center">
            {sellItem.length > 0 &&
              sellItem.map((i) => {
                return (
                  <div className="max-w-sm rounded overflow-hidden shadow-lg dashboard-card">
                    <img src={i.image} alt="#" className="w-full img" />
                    <div className="px-6 py-4 ">
                      <h5 className="font-bold text-xl mb-2">{i.name}</h5>
                      <p className="text-white-700 text-base">
                        {i.description}
                      </p>
                      <p className="text-white-700 text-base">
                        Price: {i.price} MATIC
                      </p>
                    </div>
                    <div className="px-6 pb-4">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded dashboard-sc-button"
                        onClick={() => openPopup(i)}
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {!sellItem.length && !item.length &&
        <NoItem heading="No NFT's found" content="You don't have any NFT's holding. Please mint NFT on Mint page" />}
      {showDetail && (
        <Detail setshowDetail={setshowDetail} nft_data={nft_data} />
      )}
    </div>
  );
}

export default Dashboard;
