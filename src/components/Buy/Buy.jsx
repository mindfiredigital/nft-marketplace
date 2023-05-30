import "./Buy.css";
import NoItem from "../NoItem/NoItem";
function Buy() {
  const item = [
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
    {
      image:
        "https://harlequin-major-urial-890.mypinata.cloud/ipfs/Qmc5FUhiabxZkeDWSHUk7F2kYrDZ1Y3GUC9XjWD5QFehEF",
      name: "NFT Name",
      description: "NFT Description",
      price: 0.3,
    },
  ];
// const item = []
  return (
    <div>
      {item.length > 0 ? (
        <div className="sell-page">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {item.length > 0 &&
                item.map((i) => {
                  return (
                    <div className="max-w-sm rounded overflow-hidden shadow-lg card">
                      <img src={i.image} alt="#" className="w-full" />
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
                        <button className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded sc-button">
                          Buy{" "}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        <NoItem />
      )}
    </div>
  );
}

export default Buy;
