import image from "../../assets/robo.png";
import { Button } from "@material-tailwind/react";
import './Home.css';
import React, { useContext } from "react";
import {
  checkIsMetamaskConnected, checkIsMetamaskPresent, connectToEthersLibrary,
  connectToMetamaskAccount, getChainConnected, getWalletBalance
} from '../../utils/wallet';
import { MyContext } from "../App/App";
import { supportedChains } from "../../utils/commonUtils";
import { ALERT, CHAIN_NOT_SUPPORTED_ERROR, METAMASK_NOT_FOUND_ERROR, USER_REQUEST_REJECT_ERROR } from "../../utils/messageConstants";

function Home() {

  /** Importing context API's states to use in the component*/
  const { setWeb3, isMetamaskPresent, setIsMetamaskPresent,
    walletConnected, setWalletConnected, setIsChainSupported,
    setIsModalOpen, setModalHeading, setModalDescription,
    setModalButtonEnabled, setWalletEthBalance
  } = useContext(MyContext);

  /** Connect to metamask wallet and update the context states accordingly */
  const connectWallet = async () => {
    if (!walletConnected) {
      if (!isMetamaskPresent) {
        if (checkIsMetamaskPresent()) {
          setIsMetamaskPresent(true);
          connectToMetamask();
        } else {
          setIsMetamaskPresent(false);
          setModalHeading(ALERT);
          setModalDescription(METAMASK_NOT_FOUND_ERROR);
          setModalButtonEnabled(true);
          setIsModalOpen(true);
        }
      } else {
        connectToMetamask();
      }
    }
  }

  /** Handles metamask connection */
  const connectToMetamask = async () => {
    let wallet = checkIsMetamaskConnected();
    if (!wallet) {
      wallet = await connectToMetamaskAccount();
      if (!wallet) {
        setWalletEthBalance("0");
        setModalHeading(ALERT);
        setModalDescription(USER_REQUEST_REJECT_ERROR);
        setModalButtonEnabled(true);
        setIsModalOpen(true);
        return;
      }
    }
    await checkChainConnected();
    setWeb3(connectToEthersLibrary(window.ethereum));
    setWalletConnected(wallet);
    setWalletEthBalance(await getWalletBalance(wallet));
  }

  /** To check metamask connected chain is supported by us or not */
  const checkChainConnected = async () => {
    const chain = await getChainConnected();
    if (!supportedChains[chain]) {
      setIsChainSupported(false);
      setWalletEthBalance("0");
      setModalHeading(ALERT);
      setModalDescription(CHAIN_NOT_SUPPORTED_ERROR);
      setModalButtonEnabled(true);
      setIsModalOpen(true);
    }
  }

  return (
    <div className="Home h-screen relative md:h-auto">
      <div className="grid md:grid-cols-2 gap-3 items-center p-8">
        <div>
          <h1 className="font-bold text-4xl md:text-6xl">Discover and collect your favourite digital NTFs</h1>
          <br />
          <Button variant="gradient" size="sm" fullWidth
            className="connect-wallet-btn md:inline
            mb-2 hover:text-black focus:text-black active:text-black">
            {
              walletConnected && walletConnected.length ?
                <span>{walletConnected.substring(0, 4) +
                  "..." +
                  walletConnected.substring(walletConnected.length - 4)
                }</span> :
                <span onClick={connectWallet}>Connect Wallet</span>
            }
          </Button>
        </div>
        <div>
          <img className="h-full" src={image} alt="robo" />
        </div>
      </div>
    </div>
  );
}

export default Home;
