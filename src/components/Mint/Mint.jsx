import { useContext, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./Mint.css";
import { mapformat } from "../../utils/metaDataFormat";
import { ALLOWED_IMAGE_FORMATS, PINATA_FILE_UPLOAD_URL, PINATA_JSON_UPLOAD_URL } from "../../utils/commonUtils";
import { MyContext } from "../App/App";
import { ALERT, CHAIN_NOT_SUPPORTED_ERROR, METAMASK_DISCONNECTED_ERROR } from "../../utils/messageConstants";

function Mint() {

  const [nftImage, setnftImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [nftInfo, setnftInfo] = useState({
    name: "",
    quantity: "",
    confidence: "",
    energy_level: "",
    personality: "",
    behavior: "",
    intelligence: "",
    popularity: "",
    description: ""
  });

  /** Importing context API's states to use in the component*/
  const {
    walletConnected, isChainSupported,
    setIsModalOpen, setModalHeading, setModalDescription, setModalButtonEnabled
  } = useContext(MyContext);

  // handle input change function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setnftInfo({
      ...nftInfo,
      [name]: value,
    });
  };

  // validate the input data
  function validateData(obj) {
    for (const key in obj) {
      const value = obj[key];

      if (!value || value === "") {
        setModalHeading(ALERT);
        setModalDescription("All the fields are mandatory, Please fill the form with appropriate values!");
        setModalButtonEnabled(true);
        setIsModalOpen(true);
        return false;
      }

      if (key === "quantity" && !parseInt(value)) {
        setModalHeading(ALERT);
        setModalDescription("Quantity must be entered in number");
        setModalButtonEnabled(true);
        setIsModalOpen(true);
        return false;
      }
    }
    return true;
  }

  const handleImageChange = (e) => {

    const image = e.target.files[0];

    // Extract the file extension from the file name
    var fileExtension = image.name.split(".").pop().toLowerCase();
    setImageName(image.name);

    // Check if the file extension is in the allowed extensions array
    if (ALLOWED_IMAGE_FORMATS.includes(fileExtension)) {
      setnftImage(image);
    } else {
      const allowedTypes = ALLOWED_IMAGE_FORMATS.join(", ");
      setModalHeading("Invalid Image Alert");
      setModalDescription(`The image type is invalid. Please choose an image from these extensions ${allowedTypes}.`);
      setModalButtonEnabled(true);
      setIsModalOpen(true);
    }

  }

  // Upload image on IPFS
  const uploadImageOnIpfs = async (data) => {
    try {

      const uploadResponse = await axios.post(
        PINATA_FILE_UPLOAD_URL,
        data,
        {
          maxContentLength: Infinity,
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_KEY,
          },
        }
      );

      if (uploadResponse.status === 200) {
        return uploadResponse.data.IpfsHash;
      } else {
        return null;
      }

    } catch (error) {
      console.log("Error in uploading image on IPFS : ", error);
      return null;
    }

  }

  // Uploads JSON to IPFS
  async function uploadJSON(body) {

    try {
      const uploadResponse = await axios.post(
        PINATA_JSON_UPLOAD_URL,
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
        return true;
      } else {
        return false;
      }

    } catch (error) {
      console.log("Error in uploading metadata to IPFS : ", error);
      return false;
    }
  }

  //uploads image to ipfs validate data and convert data to new format to put json on ipfs
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!walletConnected) {
      setModalHeading(ALERT);
      setModalDescription(METAMASK_DISCONNECTED_ERROR);
      setModalButtonEnabled(true);
      setIsModalOpen(true);
      return;
    }

    if (!isChainSupported) {
      setModalHeading(ALERT);
      setModalDescription(CHAIN_NOT_SUPPORTED_ERROR);
      setModalButtonEnabled(true);
      setIsModalOpen(true);
      return;
    }

    if (!validateData(nftInfo)) {
      return;
    }

    if (!nftImage) {
      const allowedTypes = ALLOWED_IMAGE_FORMATS.join(", ");
      setModalHeading("Image Alert");
      setModalDescription(`Please choose an image from these extensions ${allowedTypes}. It's mandatory to mint a NFT!`);
      setModalButtonEnabled(true);
      setIsModalOpen(true);
    }

    // check user has enough balance to pay gas fee in matic

    const formData = new FormData();
    formData.append("file", nftImage);

    setModalHeading("Minting NFT");
    setModalDescription(`NFT Image is uploading on IPFS. Please wait it may take some time to complete the process`);
    setModalButtonEnabled(false);
    setIsModalOpen(true);

    const uploadResponse = await uploadImageOnIpfs(formData);

    // Check if the image upload was successful
    if (uploadResponse) {

      setModalDescription(`NFT metadata is uploading on IPFS. Please wait it may take some time to complete the process`);
      let data = nftInfo;

      setnftInfo({
        ...nftInfo,
        image: uploadResponse,
      });

      data.image = uploadResponse;

      const jsonResponse = await uploadJSON(mapformat(data));

      // check of the metadata upload was successful
      if (jsonResponse) {
        // update modal message as per blockchain tx
        // do the blockchain tx
        // set modal message as per blockchain tx
        setModalDescription(`The metadata of your NFT with the image has been uploaded successfully on IPFS`);
        setModalButtonEnabled(true);
        setIsModalOpen(true);
        setnftInfo({
          name: "",
          quantity: "",
          confidence: "",
          energy_level: "",
          personality: "",
          behavior: "",
          intelligence: "",
          popularity: "",
          description: ""
        });
      } else {
        setModalHeading("Minting NFT Failed");
        setModalDescription(`Failed to upload NFT metadata on IPFS. Please try again`);
        setModalButtonEnabled(true);
        setIsModalOpen(true);
      }

    } else {
      setModalHeading("Minting NFT Failed");
      setModalDescription(`Failed to upload NFT Image on IPFS. Please try again`);
      setModalButtonEnabled(true);
      setIsModalOpen(true);
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
                <label className="uploadFile cursor-pointer">
                  <span className="filename">
                    {
                      (imageName && imageName.length > 0) ? imageName :
                        "Choose NFT Image"
                    }
                  </span>
                  <input
                    type="file"
                    accept="image/*"
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
                  type="number"
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
                  placeholder="Behaviour"
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
