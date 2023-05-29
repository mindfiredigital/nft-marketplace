import image from "../../assets/robo.png";
import { Button } from "@material-tailwind/react";
import './Home.css';
import React, { useContext } from "react";
import { checkIsMetamaskConnected, checkIsMetamaskPresent, connectToEthersLibrary, connectToMetamask, getWalletBalance } from '../../utils/wallet';
import { MyContext } from "../App/App";

function Home() {

  const { web3, setWeb3, isMetamaskPresent, setIsMetamaskPresent, walletConected, setWalletConnected } = useContext(MyContext);

  const connectWallet = async () => {
    if (!walletConected) {
      if (!isMetamaskPresent && checkIsMetamaskPresent()) {
        setIsMetamaskPresent(true);
        let wallet = checkIsMetamaskConnected();
        if (!wallet) {
          wallet = await connectToMetamask();
          if (!wallet) {
            // set popup message to show "User rejected metamask request for connection"
          }
        }
        // setWeb3(connectToEthersLibrary(window.ethereum));
        // setWalletConnected(wallet);
      } else {
        // set popup message to show "Please install metamask"
      }
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
              walletConected && walletConected.length ?
                <span>{walletConected.substring(0, 4) +
                  "..." +
                  walletConected.substring(walletConected.length - 4)
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
