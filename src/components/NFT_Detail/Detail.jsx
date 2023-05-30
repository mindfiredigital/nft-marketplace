import "./Detail.css";
import { useEffect, useState } from "react";
import { getNFTDetailsFromURI } from "../../utils/metaDataFormat";
export default function Detail(props) {
  const [metadata, setmetadata] = useState(null);
  useEffect(() => {
    //props.nft_data.uri will be used in place of the url
    getNFTDetailsFromURI(
      "https://harlequin-major-urial-890.mypinata.cloud/ipfs/QmYZSf2txRFgujBKZe1fboRcbGZerYvAXQDQy7AZ5JAqvD"
    )
      .then((res) => {
        if (res) {
          console.log("NFT Details:", res);
          setmetadata(res);
        } else {
          console.log("Unable to fetch NFT details");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  //this function controls closing of popup window
  const handleClose = () => {
    props.setshowDetail(false);
  };
  return (
    <div>
      {metadata && (
        <div class="overlay hidden" id="popup">
          <div class="popup">
            <h2 class="text-2xl font-bold mb-4 text-center">
              NFT Metadata Details
            </h2>
            <div class="mb-4 param">
              <strong className="param">TOKEN ID:</strong> 123456789
            </div>
            <div class="mb-4 param">
              <strong className="param">NAME:</strong> {metadata.name}
            </div>
            <div class="mb-4 param">
              <strong className="param">DESCRIPTION:</strong>{" "}
              {metadata.description}
            </div>
            {metadata.attributes.map((attr) => {
              return (
                <div class="mb-4 param">
                  <strong className="param">
                    {attr.trait_type.toUpperCase()}:
                  </strong>{" "}
                  {attr.value}
                </div>
              );
            })}
            <div class="flex justify-end">
              <button
                class="bg-green-600 hover:bg-green-800 text-white  py-2 px-4 rounded button"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
