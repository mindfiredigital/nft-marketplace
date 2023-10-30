import "./Detail.css";
import { useEffect, useState } from "react";
export default function Detail(props) {

  const [metadata, setmetadata] = useState(null);

  useEffect(() => {
    setmetadata(props.nft_data);
  }, [props]);

  const handleClose = () => {
    props.setshowDetail(false);
  };

  return (
    <div>
      {metadata && (
        <div className="overlay hidden" id="popup">
          <div className="popup">
            <h2 className="text-2xl font-bold mb-4 text-center">
              NFT Metadata Details
            </h2>
            <hr />
            <br />
            <div className="mb-4 param">
              <strong className="param">TOKEN ID :</strong> {metadata.nftId}
            </div>
            <div className="mb-4 param">
              <strong className="param">NAME :</strong> {metadata.name}
            </div>
            <div className="mb-4 param">
              <strong className="param">DESCRIPTION :</strong>{" "}
              {metadata.description}
            </div>
            {metadata.attributes.map((attr, index) => {
              return (
                <div className="mb-4 param" key={index} >
                  <strong className="param">
                    {attr.trait_type.toUpperCase()} :
                  </strong>{" "}
                  {attr.value}
                </div>
              );
            })}
            <div className="mb-4 param">
              <strong className="param">Metadata URL : </strong>
              <a
                className="break-words text-[#0000EE] underline"
                href={metadata.uri}
                target="_blank"
                rel="noreferrer"
                dangerouslySetInnerHTML={{ __html: metadata.uri }}
              >
              </a>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-green-600 hover:bg-green-800 text-white  py-2 px-4 rounded button"
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
