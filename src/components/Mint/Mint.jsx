import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudArrowUp,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
//local imports
import "./Mint.css";
import { mapformat } from "../../utils/metaDataFormat";

function Mint() {
  const [nftImage, setnftImage] = useState(null);
  const [nftInfo, setnftInfo] = useState({
    name: "",
    quantity: "",
    confidence: "",
    energy_level: "",
    personality: "",
    behavior: "",
    intelligence: "",
    popularity: "",
    description: "",
    image: "",
  });
  //handle input chnage function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setnftInfo({
      ...nftInfo,
      [name]: value,
    });
  };
 
  //validate the input data
  function validateData(obj) {
    for (const key in obj) {
      const value = obj[key];
  
      if (value === "") {
        console.log(`Validation failed: ${key} should not be empty.`);
        return false;
      }
  
      if (key === "quantity" && !Number.isInteger(value)) {
        console.log("Validation failed: quantity should be an integer.");
        return false;
      }
    }
  
    console.log("Validation passed!");
    return true;
  }
  //handle image chnage function
  const handleImageChange = (e) => {
    const image = e.target.files[0];
    // Extract the file extension from the file name
    var fileExtension = image.name.split(".").pop().toLowerCase();

    // Define an array of allowed image file extensions
    var allowedExtensions = ["jpg", "jpeg", "png", "gif"];

    // Check if the file extension is in the allowed extensions array
    if (allowedExtensions.includes(fileExtension)) {
      console.log("Image type is valid.");
      setnftImage(image);
    } else {
      console.log("Invalid image type.");
    }
  };
  //this function uploads json to ipfs
  async function uploadJSON(body) {

    const uploadResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_KEY,
        },
      }
    );
    if (uploadResponse.status === 200) {
      console.log("Metadata uploaded successfully:", uploadResponse.data);
      return true;
    }
    return false;
  }

  //uploads image to ipfs validate data and convert data to new format to put json on ipfs
  const handleSubmit = async (e) => {
    e.preventDefault();
    //upload image
    // Upload the image file to Pinata server
    if (nftImage) {
      const formData = new FormData();
      formData.append("file", nftImage);
      const uploadResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxContentLength: Infinity,
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_KEY,
          },
        }
      );

      // Check if the upload was successful
      if (uploadResponse.status === 200) {
        console.log(uploadResponse, "r");
        let data = nftInfo;
        setnftInfo({
          ...nftInfo,
          image: uploadResponse.data.IpfsHash,
        });
        data.image = uploadResponse.data.IpfsHash;
        if (validateData(data)) {
          //console.log(mapformat(data));
          uploadJSON(mapformat(data));
          //here smart contract will be called to put the token uri
        }

        console.log("Image uploaded successfully!");
      } else {
        console.log("Upload failed.");
      }
    } else {
      console.log("image cannot be null");
    }
  };

  return (
    <div className="create-item-container">
      <div className="form-create-item-content">
        <div className="form-create-item">
          <div className="row">
            <div className="col-sm-12">
              <h1 className="text-left sc-heading">Create NFT</h1>
              <p className="text-left sc-heading">
                Most popular nft market place for celebrities
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row form-background">
              <div className="col-sm-12">
                <label className="uploadFile">
                  <span className="filename">Choose NFT Image</span>
                  <input
                    type="file"
                    className="inputfile form-control"
                    name="file"
                    onChange={handleImageChange}
                  />
                  <span className="icon">
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                  </span>
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12 form-background input-group">
                <input
                  type="text"
                  className="form-control item-1"
                  name="name"
                  placeholder="NFT Name"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control item-2"
                  placeholder="NFT Quantities"
                  name="quantity"
                  onChange={handleChange}
                />
              </div>
              <div className="col input-group">
                <input
                  type="text"
                  className="form-control item-1"
                  name="confidence"
                  placeholder="Confidence"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control item-2"
                  name="energy_level"
                  placeholder="Energy Level"
                  onChange={handleChange}
                />
              </div>
              <div className="col input-group">
                <input
                  type="text"
                  className="form-control item-1"
                  placeholder="Personality"
                  name="personality"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control item-2"
                  placeholder="Behavior"
                  name="behavior"
                  onChange={handleChange}
                />
              </div>
              <div className="col input-group">
                <input
                  type="text"
                  className="form-control item-1"
                  placeholder="Intelligence"
                  name="intelligence"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control item-2"
                  placeholder="Popularity"
                  name="popularity"
                  onChange={handleChange}
                />
              </div>
              <div className="col "></div>
              <textarea
                className="form-control col-12 row-3 input-group text"
                placeholder="NFT Description"
                name="description"
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="row">
              <div className="col-sm-12 text-center">
                <button
                  name="submit"
                  type="submit"
                  id="submit"
                  className="sc-button"
                >
                  <span>
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </span>
                  Mint NFT
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Mint;
