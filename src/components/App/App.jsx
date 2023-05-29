import { Outlet } from "react-router-dom";
import { useState, createContext } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export const MyContext = createContext();

function App() {

    const [web3, setWeb3] = useState(null);
    const [isMetamaskPresent, setIsMetamaskPresent] = useState(false);
    const [walletConected, setWalletConnected] = useState(null);

    return (
        <div>
            <MyContext.Provider value={{
                web3, setWeb3, isMetamaskPresent,
                setIsMetamaskPresent, walletConected, setWalletConnected
            }}>
                <Header />
                <div className="min-h-[calc(100vh-164px)]">
                    <Outlet />
                </div>
                <div className="bottom-0 absolute md:relative">
                    <Footer />
                </div>
            </MyContext.Provider>
        </div>
    );
}

export default App;
