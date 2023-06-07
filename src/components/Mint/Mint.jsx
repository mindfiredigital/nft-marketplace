import { useContext, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import "./Mint.css";
import { mapformat } from "../../utils/metaDataFormat";
import { ALLOWED_IMAGE_FORMATS, PINATA_FILE_UPLOAD_URL, PINATA_JSON_UPLOAD_URL } from "../../utils/commonUtils";
import { MyContext } from "../App/App";
import { ALERT, ATTRIBUTES_NUMERIC_VALUE_ERROR, CHAIN_NOT_SUPPORTED_ERROR, METAMASK_DISCONNECTED_ERROR, SUCCESSFUL_TRANSACTION, TRANSACTION_HASH } from "../../utils/messageConstants";
import { convertToEther, getWalletBalance } from "../../utils/wallet";
import { useNavigate } from "react-router-dom";

function Mint() {

  const [nftImage, setnftImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [nftInfo, setnftInfo] = useState({
    name: "",
    description: "",
    quantity: "",
    rarity: "",
    style: "",
    beauty: "",
    comedy: "",
    action: ""
  });

  /** Importing context API's states to use in the component*/
  const {
    web3, walletConnected, isChainSupported, nftContract, walletEthBalance,
    setWalletEthBalance, setIsModalOpen, setModalHeading, setModalDescription,
    setModalButtonEnabled, chainConfig
  } = useContext(MyContext);

  const navigate = useNavigate();

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

      if (key === "quantity") {
        if (!(value <= 100) || !(value > 0)) {
          setModalHeading(ALERT);
          setModalDescription(ATTRIBUTES_NUMERIC_VALUE_ERROR);
          setModalButtonEnabled(true);
          setIsModalOpen(true);
          return false;
        }
      } else if (key != "name" && key != "description") {
        if (!(value <= 10) || !(value > 0)) {
          setModalHeading(ALERT);
          setModalDescription(ATTRIBUTES_NUMERIC_VALUE_ERROR);
          setModalButtonEnabled(true);
          setIsModalOpen(true);
          return false;
        }
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
    setModalDescription(`NFT image is uploading on IPFS. Please wait it may take some time to complete the process`);
    setModalButtonEnabled(false);
    setIsModalOpen(true);

    // check user has enough balance to pay gas fee in matic
    const check = await checkUserHasSufficientBalanceForTx(nftInfo.quantity, chainConfig.explorerUrl);

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
          description: "",
          quantity: "",
          rarity: "",
          style: "",
          beauty: "",
          comedy: "",
          action: ""
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
          url = chainConfig.explorerUrl + hash;
          setModalDescription(`${TRANSACTION_HASH} <a class="text-indigo-500" target="_blank" href="${url}">${url}</a>`);
        })
        .on("receipt", async () => {
          setModalDescription(`${SUCCESSFUL_TRANSACTION} <a class="text-indigo-500" target="_blank" href="${url}">${url}</a>`);
          setWalletEthBalance(await getWalletBalance(walletConnected));
          setModalButtonEnabled(true);
          setIsModalOpen(false);
          navigate('/dashboard')
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

  return (
    <div className="create-item-container">
      <div className="form-create-item-content">
        <div className="form-create-item">
          <div className="row">
            <div className="col-sm-12">
              <h1 className="text-left sc-heading main-heading">Create NFT</h1>
              <p className="text-left sc-heading">
                Most popular nft market place for celebrities
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 form-background">
              <div>
                <label className="uploadFile cursor-pointer">
                  <span className="filename">
                    {
                      (imageName && imageName.length > 0) ? imageName :
                        "Choose Image"
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
              <div className="mt-5 mb-5">
                <input
                  type="text"
                  className="item-1"
                  name="name"
                  value={nftInfo.name}
                  placeholder="NFT Name"
                  onChange={handleChange}
                />
              </div>
            </div>

            <textarea
              className="form-control col-12 row-3 input-group text"
              placeholder="NFT Description"
              name="description"
              value={nftInfo.description}
              onChange={handleChange}
            ></textarea>

            <br />
            <br />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">

              <div className="text-center">
                <label htmlFor="">Quantity</label>
                <br />
                <div className="mt-3">
                  <input
                    type="number"
                    className="form-control nft-input-rating"
                    name="quantity"
                    value={nftInfo.quantity}
                    placeholder="1"
                    onChange={handleChange}
                  />
                  <label htmlFor="" className="text-[19px]"> of </label>
                  <input
                    type="number"
                    className="form-control nft-input-rating"
                    name="max_quantity"
                    value={100}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="text-center">
                <label htmlFor="">Rarity</label>
                <br />
                <div className="mt-3">
                  <input
                    type="number"
                    className="form-control nft-input-rating"
                    name="rarity"
                    value={nftInfo.rarity}
                    placeholder="1"
                    onChange={handleChange}
                  />
                  <label htmlFor="" className="text-[19px]"> of </label>
                  <input
                    type="number"
                    className="form-control nft-input-rating"
                    name="max_rarity"
                    value={10}
                    disabled={true}
                  />
                </div>
              </div>

            </div>

            <br />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
              <div className="text-center">
                <label htmlFor="">Style</label>
                <br />
                <div className="mt-3">
                  <input
                    type="number"
                    className="form-control nft-input-rating"
                    name="style"
                    value={nftInfo.style}
                    placeholder="1"
                    onChange={handleChange}
                  />
                  <label htmlFor="" className="text-[19px]"> of </label>
                  <input
                    type="number"
                    className="form-control nft-input-rating"
                    name="max_style"
                    value={10}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="text-center">
                <label htmlFor="">Beauty</label>
                <br />
                <div className="mt-3">
                  <input
                    type="number"
                    className="form-control nft-input-rating"
                    name="beauty"
                    value={nftInfo.beauty}
                    placeholder="1"
                    onChange={handleChange}
                  />
                  <label htmlFor="" className="text-[19px]"> of </label>
                  <input
                    type="number"
                    className="form-control nft-input-rating"
                    name="max_beauty"
                    value={10}
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            <br />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8">
              <div className="text-center">
                <label htmlFor="">Comedy</label>
                <br />
                <div className="mt-3">
                  <input
                    type="number"
                    className="form-control nft-input-rating"
                    name="comedy"
                    value={nftInfo.comedy}
                    placeholder="1"
                    onChange={handleChange}
                  />
                  <label htmlFor="" className="text-[19px]"> of </label>
                  <input
                    type="number"
                    className="form-control nft-input-rating"
                    name="max_comedy"
                    value={10}
                    disabled={true}
                  />
                </div>
              </div>

              <div className="text-center">
                <label htmlFor="">Action</label>
                <br />
                <div className="mt-3">
                  <input
                    type="number"
                    className="form-control nft-input-rating"
                    name="action"
                    value={nftInfo.action}
                    placeholder="1"
                    onChange={handleChange}
                  />
                  <label htmlFor="" className="text-[19px]"> of </label>
                  <input
                    type="number"
                    className="form-control nft-input-rating"
                    name="max_action"
                    value={10}
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-12 text-center">
                <br />
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