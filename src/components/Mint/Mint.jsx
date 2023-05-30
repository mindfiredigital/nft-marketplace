import { useContext, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./Mint.css";
import { mapformat } from "../../utils/metaDataFormat";
import { ALLOWED_IMAGE_FORMATS, MATIC_TX_EXPLORER_URL, PINATA_FILE_UPLOAD_URL, PINATA_JSON_UPLOAD_URL } from "../../utils/commonUtils";
import { MyContext } from "../App/App";
import { ALERT, CHAIN_NOT_SUPPORTED_ERROR, METAMASK_DISCONNECTED_ERROR, SUCCESSFUL_TRANSACTION, TRANSACTION_HASH } from "../../utils/messageConstants";
import { getWalletBalance } from "../../utils/wallet";

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
    web3, walletConnected, isChainSupported, nftContract, walletEthBalance,
    setWalletEthBalance, setIsModalOpen, setModalHeading, setModalDescription,
    setModalButtonEnabled, marketplaceContract
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
        return uploadResponse.data.IpfsHash;
      } else {
        return null;
      }

    } catch (error) {
      console.log("Error in uploading metadata to IPFS : ", error);
      return null;
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
      return;
    }

    setModalHeading("Minting NFT");
    setModalDescription(`NFT Image is uploading on IPFS. Please wait it may take some time to complete the process`);
    setModalButtonEnabled(false);
    setIsModalOpen(true);

    // check user has enough balance to pay gas fee in matic
    const check = await checkUserHasSufficientBalanceForTx(nftInfo.quantity, MATIC_TX_EXPLORER_URL);

    if (!check.status) {
      setModalHeading("Mint NFT Failed");
      setModalDescription(`Failed to mint NFT because your account doesn't have sufficient balance to pay transaction gas fee!`);
      setModalButtonEnabled(true);
      setIsModalOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("file", nftImage);

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

        setModalDescription(`Your NFT mint transacion is in progress, Please wait as it can take some time to complete due to heavy traffic on network!`);

        await mint(nftInfo.quantity, jsonResponse, check.gas);

        setImageName("");
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

  /** Execute NFT mint function in Fandom NFT smart contract */
  const mint = async (amount, uri, gas) => {
    try {

      let url = "";

      await nftContract.methods.mint(amount, uri)
        .send({
          from: walletConnected,
          gasLimit: gas
        })
        .on("transactionHash", (hash) => {
          url = MATIC_TX_EXPLORER_URL + hash;
          setModalDescription(`${TRANSACTION_HASH} <a class="text-indigo-500" target="_blank" href="${url}">${url}</a>`);
        })
        .on("receipt", async () => {
          setModalDescription(`${SUCCESSFUL_TRANSACTION} <a class="text-indigo-500" target="_blank" href="${url}">${url}</a>`);
          setWalletEthBalance(await getWalletBalance(walletConnected));
          setModalButtonEnabled(true);
        })
        .on("error", async (error) => {
          setModalHeading("Minting NFT Failed");
          setModalDescription(`Failed to mint NFT. ${error.message}`);
          setModalButtonEnabled(true);
          setWalletEthBalance(await getWalletBalance(walletConnected));
        })

    } catch (error) {
      console.log("error in catch : ", error);
      setModalHeading("Minting NFT Failed");
      setModalDescription(`Failed to mint NFT. ${error.message}`);
      setModalButtonEnabled(true);
    }
  }

  const checkUserHasSufficientBalanceForTx = async (amount, uri) => {
    try {
      const gasLimit = await nftContract.methods.mint(amount, uri)
        .estimateGas({ from: walletConnected });

      const bufferedGasLimit = Math.round(
        Number(gasLimit) + (Number(gasLimit) * Number(0.2))
      );

      const currentGasPrice = await web3.eth.getGasPrice();
      const txFee = currentGasPrice * bufferedGasLimit;
      const feeInEth = web3.utils.fromWei(txFee.toString(), 'ether');

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
                  value={nftInfo.name}
                  placeholder="NFT Name"
                  onChange={handleChange}
                />
                <input
                  type="number"
                  className="form-control item-2"
                  placeholder="NFT Quantities"
                  name="quantity"
                  value={nftInfo.quantity}
                  onChange={handleChange}
                />
              </div>
              <div className="col input-group">
                <input
                  type="text"
                  className="form-control item-1"
                  name="confidence"
                  value={nftInfo.confidence}
                  placeholder="Confidence"
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control item-2"
                  name="energy_level"
                  value={nftInfo.energy_level}
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
                  value={nftInfo.personality}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control item-2"
                  placeholder="Behaviour"
                  name="behavior"
                  value={nftInfo.behavior}
                  onChange={handleChange}
                />
              </div>
              <div className="col input-group">
                <input
                  type="text"
                  className="form-control item-1"
                  placeholder="Intelligence"
                  name="intelligence"
                  value={nftInfo.intelligence}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  className="form-control item-2"
                  placeholder="Popularity"
                  name="popularity"
                  value={nftInfo.popularity}
                  onChange={handleChange}
                />
              </div>
              <div className="col "></div>
              <textarea
                className="form-control col-12 row-3 input-group text"
                placeholder="NFT Description"
                name="description"
                value={nftInfo.description}
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
