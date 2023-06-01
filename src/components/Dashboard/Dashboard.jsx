import { useState } from "react";
import "./Dashboard.css";
import Detail from "../NFT_Detail/Detail";
import NoItem from "../NoItem/NoItem";
function Dashboard() {
  const [showDetail, setshowDetail] = useState(false);
  const [nft_data, setnft_data] = useState(null);
  let item = [
    {
      image:
        "https://harlequin-major-urial-890.mypinata.cloud/ipfs/Qmc5FUhiabxZkeDWSHUk7F2kYrDZ1Y3GUC9XjWD5QFehEF",
      name: "NFT Name",
      description: "NFT Description",
      price: 0.3,
    },
    {
      image:
        "https://harlequin-major-urial-890.mypinata.cloud/ipfs/Qmc5FUhiabxZkeDWSHUk7F2kYrDZ1Y3GUC9XjWD5QFehEF",
      name: "NFT Name",
      description: "NFT Description",
      price: 0.3,
    },

    {
      image:
        "https://harlequin-major-urial-890.mypinata.cloud/ipfs/Qmc5FUhiabxZkeDWSHUk7F2kYrDZ1Y3GUC9XjWD5QFehEF",
      name: "NFT Name",
      description: "NFT Description",
      price: 0.3,
    },
    {
      image:
        "https://harlequin-major-urial-890.mypinata.cloud/ipfs/Qmc5FUhiabxZkeDWSHUk7F2kYrDZ1Y3GUC9XjWD5QFehEF",
      name: "NFT Name",
      description: "NFT Description",
      price: 0.3,
    },
  ];
  const openPopup = (i) => {
    setshowDetail(true);
    setnft_data(i);
  };
  return (
    <div className="create-item-containers">
      <div className="h">
        <h3>My NFT</h3>
      </div>
      <div className="flex flex-wrap items-center my-[25px] justify-center">
        {item.length > 0 &&
          item.map((i) => {
            return (
              <div className="max-w-sm rounded overflow-hidden shadow-lg card">
                <img src={i.image} alt="#" className="w-full" />
                <div className="px-6 py-4 ">
                  <h5 className="font-bold text-xl mb-2">{i.name}</h5>
                  <p className="text-white-700 text-base">{i.description}</p>
                  <p className="text-white-700 text-base">
                    Price: {i.price} MATIC
                  </p>
                </div>
                <div className="px-6 pb-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded sc-button"
                    onClick={() => openPopup(i)}
                  >
                    Detail
                  </button>
                </div>
              </div>
            );
          })}
      </div>
      <div className="h">
        <h3>My NFT on Sale</h3>
      </div>
      <div className="flex flex-wrap items-center my-[25px] justify-center">
        {item.length > 0 &&
          item.map((i) => {
            return (
              <div className="max-w-sm rounded overflow-hidden shadow-lg card">
                <img src={i.image} alt="#" className="w-full" />
                <div className="px-6 py-4 ">
                  <h5 className="font-bold text-xl mb-2">{i.name}</h5>
                  <p className="text-white-700 text-base">{i.description}</p>
                  <p className="text-white-700 text-base">
                    Price: {i.price} MATIC
                  </p>
                </div>
                <div className="px-6 pb-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded sc-button"
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
  );
}

export default Dashboard;
