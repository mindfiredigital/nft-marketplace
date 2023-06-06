import React, { useContext, useEffect } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import './Header.css';
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import {
  checkIsMetamaskPresent, connectToWeb3,
  getChainConnected, getWalletBalance, connectToSpecificMetamaskNetwork, connectToMetamaskAccount
} from "../../utils/wallet";
import { MyContext } from "../App/App";
import { chainProperties, supportedChains } from "../../utils/commonUtils";
import { ALERT, CHAIN_NOT_SUPPORTED_ERROR, METAMASK_NOT_FOUND_ERROR, USER_REQUEST_REJECT_ERROR } from "../../utils/messageConstants";
import { nftAbi } from "../../utils/abis/fandomNftAbi";
import { marketplaceAbi } from "../../utils/abis/marketplaceAbi";

export default function Header() {

  /** Importing context API's states to use in the component*/
  const { web3, setWeb3, isMetamaskPresent, setIsMetamaskPresent,
    walletConnected, setWalletConnected, setIsChainSupported,
    setIsModalOpen, setModalHeading, setModalDescription,
    setModalButtonEnabled, walletEthBalance, setWalletEthBalance,
    setMarketplaceContract, setNftContract, isChainSupported,
    chainConfig, setChainConfig, setIsNetworkModalOpen,
    networkSelected, setNetworkSelected, networkList
  } = useContext(MyContext);

  /** States to open and close navbar in small devices */
  const [openNav, setOpenNav] = React.useState(false);

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
    const wallet = await connectToSpecificMetamaskNetwork(networkList[0].id);
    if (!wallet) {
      setWalletEthBalance("0");
      setModalHeading(ALERT);
      setModalDescription(USER_REQUEST_REJECT_ERROR);
      setModalButtonEnabled(true);
      setIsModalOpen(true);
      return false;
    }
    const chainCheck = await checkChainConnected();
    if (chainCheck) {
      setNetworkSelected(networkList[0].name);
      setWeb3(connectToWeb3(window.ethereum));
      const wal = await connectToMetamaskAccount();
      setWalletConnected(wal);
      setWalletEthBalance(await getWalletBalance(wal));
    }
    return true;
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
      setChainConfig(null);
      return false;
    } else {
      setIsChainSupported(true);
      setChainConfig(chainProperties[chain]);
      return true;
    }
  }

  useEffect(() => {
    if (web3 && chainConfig) {
      setNftContract(new web3.eth.Contract(nftAbi, chainConfig.nftAddress));
      setMarketplaceContract(new web3.eth.Contract(marketplaceAbi, chainConfig.marketplaceAddress));
    }
  }, [web3, setNftContract, setMarketplaceContract, chainConfig]);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/" className="flex items-center text-base hover:text-[#ee82ee]">
          <b>
            Home
          </b>
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/dashboard" className="flex items-center text-base hover:text-[#ee82ee]">
          <b>
            Dashboard
          </b>
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/mint" className="flex items-center text-base hover:text-[#ee82ee]">
          <b>
            Mint
          </b>
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/buy" className="flex items-center text-base hover:text-[#ee82ee]">
          <b>
            Buy
          </b>
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/sell" className="flex items-center text-base hover:text-[#ee82ee]">
          <b>
            Sell
          </b>
        </Link>
      </Typography>
    </ul>
  );

  const selectNetwork = async () => {
    setIsNetworkModalOpen(true);
  }

  return (
    <>
      <Navbar className="sticky bg-black text-white inset-0 z-10 h-max max-w-full rounded-none py-2 px-4 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Link to="/">
            <img className="h-16 cursor-pointer" src={logo} alt="logo" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>

            <Button
              variant="gradient"
              size="sm"
              className="connect-wallet-btn
                hidden lg:inline-block hover:text-black focus:text-black active:text-black"
              onClick={selectNetwork}
            >
              {networkSelected}
            </Button>

            {(walletConnected && isChainSupported) ?
              <Button
                variant="gradient"
                size="sm"
                className="connect-wallet-btn
                          hidden lg:inline-block"
              >
                <span>Bal: {
                  !!walletEthBalance ? walletEthBalance.substring(0, 6) :
                    walletEthBalance
                } {chainConfig ? chainConfig.currency : ""}</span>
              </Button> : <></>
            }
            <Button
              variant="gradient"
              size="sm"
              className="connect-wallet-btn
                hidden lg:inline-block hover:text-black focus:text-black active:text-black"
              onClick={connectWallet}
            >
              {
                walletConnected && walletConnected.length ?
                  <span>{walletConnected.substring(0, 4) +
                    "..." +
                    walletConnected.substring(walletConnected.length - 4)
                  }</span> :
                  <span >Connect Wallet</span>
              }
            </Button>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 icon-btn text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6 relative"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 relative"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
        <MobileNav open={openNav}>
          {navList}

          <Button variant="gradient" size="sm" fullWidth
            className="connect-wallet-btn
            mb-2 hover:text-black focus:text-black active:text-black"
            onClick={selectNetwork}
          >
            {
              networkSelected
            }
          </Button>

          {(walletConnected && isChainSupported) ?
            <Button variant="gradient" size="sm" fullWidth
              className="connect-wallet-btn
            mb-2">
              <span>Bal: {
                !!walletEthBalance ? walletEthBalance.substring(0, 6) :
                  walletEthBalance
              } {chainConfig ? chainConfig.currency : ""}</span>
            </Button> : <></>
          }
          <Button variant="gradient" size="sm" fullWidth
            className="connect-wallet-btn
            mb-2 hover:text-black focus:text-black active:text-black"
            onClick={connectWallet}
          >
            {
              walletConnected && walletConnected.length ?
                <span>{walletConnected.substring(0, 4) +
                  "..." +
                  walletConnected.substring(walletConnected.length - 4)
                }</span> :
                <span>Connect Wallet</span>
            }
          </Button>
        </MobileNav>
      </Navbar>
    </>
  );
}