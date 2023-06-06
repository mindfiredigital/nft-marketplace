import { Outlet } from "react-router-dom";
import { useState, createContext, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Modal from "../Modal/Modal";
import { chainProperties, supportedChains } from "../../utils/commonUtils";
import { checkIsMetamaskConnected, connectToWeb3, connectToMetamaskAccount, getWalletBalance } from "../../utils/wallet";
import { ALERT, CHAIN_NOT_SUPPORTED_ERROR, METAMASK_DISCONNECTED_ERROR, USER_REQUEST_REJECT_ERROR } from "../../utils/messageConstants";
import NetworkModal from "../NetworkModal/NetworkModal";

export const MyContext = createContext();

function App() {

    /** States related to modal popup box */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalHeading, setModalHeading] = useState("");
    const [modalDescription, setModalDescription] = useState("");
    const [modalButtonEnabled, setModalButtonEnabled] = useState(false);

    /** States related to modal popup box */
    const [isNetworkModalOpen, setIsNetworkModalOpen] = useState(false);

    /** States for context API's */
    const [web3, setWeb3] = useState(null);
    const [isMetamaskPresent, setIsMetamaskPresent] = useState(false);
    const [walletConnected, setWalletConnected] = useState(null);
    const [isChainSupported, setIsChainSupported] = useState(false);
    const [walletEthBalance, setWalletEthBalance] = useState("0");
    const [nftContract, setNftContract] = useState(null);
    const [marketplaceContract, setMarketplaceContract] = useState(null);
    const [chainConfig, setChainConfig] = useState(null);
    const [networkSelected, setNetworkSelected] = useState("Select Network");
    const [networkList, setNetworkList] = useState([]);

    if (window.ethereum) {

        /** Handles account changed event thrown by metamask and updates context states accordingly */
        window.ethereum.on('accountsChanged', async (accounts) => {
            if (!accounts[0]) {
                setWalletConnected(null);
                setWeb3(null);
                setWalletEthBalance("0");
                setNetworkSelected("Select Network");
                setModalHeading(ALERT);
                setModalDescription(METAMASK_DISCONNECTED_ERROR);
                setModalButtonEnabled(true);
                setIsModalOpen(true);
            } else {
                setWalletConnected(accounts[0]);
                setWalletEthBalance(await getWalletBalance(accounts[0]));
            }
        });

        /** Handles chain changed event thrown by metamask and updates context states accordingly */
        window.ethereum.on('chainChanged', async (chain) => {
            if (!supportedChains[chain]) {
                setIsChainSupported(false);
                setWalletEthBalance("0");
                setModalHeading(ALERT);
                setModalDescription(CHAIN_NOT_SUPPORTED_ERROR);
                setModalButtonEnabled(true);
                setIsModalOpen(true);
                setChainConfig(null);
                setWalletConnected(null);
                setNetworkSelected("Select Network");
            } else {
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
                setWeb3(connectToWeb3(window.ethereum));
                setChainConfig(chainProperties[chain]);
                setWalletConnected(wallet);
                setIsChainSupported(true);
                setWalletEthBalance(await getWalletBalance(wallet));
                setNetworkSelected(chainProperties[chain].chain);
            }
        });

    }

    useEffect(() => {
        let networks = Object.entries(supportedChains).map(([k, v]) => ({ ["name"]: v, ["id"]: k }));
        setNetworkList(networks);
    }, []);

    return (
        <div>
            <MyContext.Provider value={{
                web3, setWeb3, isMetamaskPresent,
                setIsMetamaskPresent, walletConnected, setWalletConnected,
                isChainSupported, setIsChainSupported,
                isModalOpen, setIsModalOpen,
                modalHeading, setModalHeading,
                modalDescription, setModalDescription,
                modalButtonEnabled, setModalButtonEnabled,
                walletEthBalance, setWalletEthBalance,
                nftContract, setNftContract,
                marketplaceContract, setMarketplaceContract,
                chainConfig, setChainConfig,
                networkSelected, setNetworkSelected,
                networkList, setNetworkList, isNetworkModalOpen,
                setIsNetworkModalOpen
            }}>
                <Header />
                <div className="min-h-[calc(100vh-164px)] bg-[#282c34]">
                    <Outlet />
                </div>
                <div className="bottom-0">
                    <Footer />
                </div>
            </MyContext.Provider>
            {isModalOpen &&
                <Modal setIsModalOpen={setIsModalOpen}
                    heading={modalHeading}
                    description={modalDescription}
                    isButtonEnabled={modalButtonEnabled}
                />
            }
            {isNetworkModalOpen &&
                <NetworkModal
                    setIsNetworkModalOpen={setIsNetworkModalOpen}
                    data={networkList}
                    setIsModalOpen={setIsModalOpen}
                    setModalHeading={setModalHeading}
                    setModalDescription={setModalDescription}
                    setModalButtonEnabled={setModalButtonEnabled}
                    setNetworkSelected={setNetworkSelected}
                    setWalletEthBalance={setWalletEthBalance}
                    setChainConfig={setChainConfig}
                    setWalletConnected={setWalletConnected}
                    walletConnected={walletConnected}
                    setWeb3={setWeb3}
                    setIsChainSupported={setIsChainSupported}
                />
            }
        </div>
    );
}

export default App;
