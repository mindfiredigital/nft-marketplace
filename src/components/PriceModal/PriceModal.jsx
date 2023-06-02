import "./PriceModal.css";
import { useContext, useState } from "react";
import { MATIC_TX_EXPLORER_URL, REGEX_FOR_PRICE } from "../../utils/commonUtils";
import { MyContext } from "../App/App";
import { convertToEther, convertToWei, getWalletBalance } from "../../utils/wallet";
import { ALERT, NATIVE_TOKEN, SUCCESSFUL_TRANSACTION, TRANSACTION_HASH } from "../../utils/messageConstants";
import { marketplaceContractAddress } from "../../utils/abis/marketplaceAbi";
export default function PriceModal(props) {

    /** Stores new price of NFT to be sold */
    const [price, setPrice] = useState();

    /** Importing context API's states to use in the component*/
    const {
        web3, walletConnected, setIsModalOpen, setModalHeading, walletEthBalance, nftContract,
        setWalletEthBalance, marketplaceContract, setModalDescription, setModalButtonEnabled
    } = useContext(MyContext);

    const handleCancel = () => {
        setPrice();
        props.setShowPricePopup(false);
    };

    const handleChange = (e) => {
        const { value } = e.target;
        const check = new RegExp(REGEX_FOR_PRICE).test(value);
        if (check) {
            setPrice(value);
        }
    };

    /** Handles confirmation of user for selling NFT */
    const handleConfirm = async () => {

        const newPrice = Number(price);

        if (newPrice) {

            props.setShowPricePopup(false);
            setPrice();

            if (newPrice < Number(props.listPrice)) {
                setIsModalOpen(true);
                setModalHeading("Sell Transaction");
                setModalDescription(`The selling price of NFT can't be less than listing price that is ${props.listPrice} ${NATIVE_TOKEN}. Please try with greater amount!`);
                setModalButtonEnabled(true);
                return;
            }

            setIsModalOpen(true);
            setModalHeading("Approval Transaction");
            setModalDescription("Your sell transacion is in progress, Please wait as it can take some time to complete due to heavy traffic on network!")
            setModalButtonEnabled(false);

            const priceInWei = convertToWei(newPrice.toString(), 18);
            const tokenId = props.nftData.nftId;
            const amount = props.nftData.amount;

            await approvalTransaction(tokenId, priceInWei, amount);

        } else {
            props.setShowPricePopup(false);
            setPrice();
            setIsModalOpen(true);
            setModalHeading(ALERT);
            setModalDescription("Invalid price! Please enter correct value for NFT sell price");
            setModalButtonEnabled(true);
        }
    };

    /** Checks user has sufficient balance to put NFT on sale or not */
    const checkUserHasSufficientBalanceForTx = async (tokenId, price, amount, listingPriceInWei) => {

        try {

            const gasLimit = await marketplaceContract.methods.createMarketItem(tokenId, price, amount)
                .estimateGas({ from: walletConnected, value: listingPriceInWei });

            const bufferedGasLimit = Math.round(
                Number(gasLimit) + (Number(gasLimit) * Number(0.2))
            );

            const currentGasPrice = await web3.eth.getGasPrice();
            const txFee = (Number(currentGasPrice) * bufferedGasLimit) + Number(listingPriceInWei);
            const feeInEth = convertToEther(txFee.toString(), 18);

            if (Number(walletEthBalance) < Number(feeInEth)) {
                return { gas: bufferedGasLimit, status: false };
            } else {
                return { gas: bufferedGasLimit, status: true };
            }

        } catch (error) {
            console.log("Error in estimating transaction fee : ", JSON.stringify(error));
            return { gas: 0, status: false };
        }

    }

    /** Checks user has sufficient balance to give approval to contract or not */
    const checkUserHasSufficientBalanceForApproval = async () => {

        try {

            const gasLimit = await nftContract.methods.setApprovalForAll(marketplaceContractAddress, true)
                .estimateGas({ from: walletConnected });

            const bufferedGasLimit = Math.round(
                Number(gasLimit) + (Number(gasLimit) * Number(0.2))
            );

            const currentGasPrice = await web3.eth.getGasPrice();
            const txFee = (currentGasPrice * bufferedGasLimit);
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

    /** Execute NFT list function in NFT marketplace smart contract */
    const sellTransaction = async (tokenId, price, amount, gas, listingPriceInWei) => {
        try {

            let url = "";

            await marketplaceContract.methods.createMarketItem(tokenId, price, amount)
                .send({
                    from: walletConnected,
                    gasLimit: gas,
                    value: listingPriceInWei
                })
                .on("transactionHash", (hash) => {
                    url = MATIC_TX_EXPLORER_URL + hash;
                    setModalDescription(`${TRANSACTION_HASH} <a class="text-indigo-500" target="_blank" href="${url}">${url}</a>`);
                })
                .on("receipt", async () => {
                    setModalDescription(`${SUCCESSFUL_TRANSACTION} <a class="text-indigo-500" target="_blank" href="${url}">${url}</a>`);
                    setWalletEthBalance(await getWalletBalance(walletConnected));
                    const fetchNftsFromIpfs = props.setNftItem;
                    await fetchNftsFromIpfs();
                    setModalButtonEnabled(true);
                })
                .on("error", async (error) => {
                    setModalHeading("Sell Transaction Failed");
                    setModalDescription(`Failed to put NFT on sale. ${error.message}`);
                    setModalButtonEnabled(true);
                    setWalletEthBalance(await getWalletBalance(walletConnected));
                })

        } catch (error) {
            console.log("error in catch : ", error);
            setModalHeading("Sell Transaction Failed");
            setModalDescription(`Failed to put NFT on sale. ${error.message}`);
            setModalButtonEnabled(true);
        }
    }

    /** Executes approval transaction from user to contract*/
    const approvalTransaction = async (tokenId, priceInWei, amount) => {

        const check = await nftContract.methods
            .isApprovedForAll(walletConnected, marketplaceContractAddress).call({
                from: walletConnected
            });

        if (check) {
            setModalHeading("Sell Transaction");
            await executeFinalTransaction(tokenId, priceInWei, amount);
        } else {

            const check = await checkUserHasSufficientBalanceForApproval();

            if (!check.status) {
                setModalHeading("Approval Transaction Failed");
                setModalDescription(`Transaction failed because your account doesn't have sufficient balance to pay gas fees!`);
                setModalButtonEnabled(true);
                setIsModalOpen(true);
                return;
            }

            try {

                let url = "";

                await await nftContract.methods.setApprovalForAll(marketplaceContractAddress, true)
                    .send({
                        from: walletConnected,
                        gasLimit: check.gas
                    })
                    .on("transactionHash", (hash) => {
                        url = MATIC_TX_EXPLORER_URL + hash;
                        setModalDescription(`${TRANSACTION_HASH} <a class="text-indigo-500" target="_blank" href="${url}">${url}</a>`);
                    })
                    .on("receipt", async () => {

                        setModalHeading("Sell Transaction");
                        setModalDescription(`Please confirm the sell transaction in metamask`);
                        setWalletEthBalance(await getWalletBalance(walletConnected));
                        await executeFinalTransaction(tokenId, priceInWei, amount);

                    })
                    .on("error", async (error) => {
                        setModalHeading("Approval Transaction Failed");
                        setModalDescription(`Failed to put NFT on sale. ${error.message}`);
                        setModalButtonEnabled(true);
                        setWalletEthBalance(await getWalletBalance(walletConnected));
                    })

            } catch (error) {
                console.log("error in catch : ", error);
                setModalHeading("Approval Transaction Failed");
                setModalDescription(`Failed to put NFT on sale. ${error.message}`);
                setModalButtonEnabled(true);
                return;
            }
        }

    }

    /** Executes sell transaction after approval */
    const executeFinalTransaction = async (tokenId, priceInWei, amount) => {

        const listingPriceInWei = convertToWei(props.listPrice, 18);
        const balanceCheck = await checkUserHasSufficientBalanceForTx(tokenId, priceInWei, amount, listingPriceInWei);

        if (!balanceCheck.status) {
            setModalHeading("Sell Transaction Failed");
            setModalDescription(`Transaction failed because your account doesn't have sufficient balance!`);
            setModalButtonEnabled(true);
            setIsModalOpen(true);
            return;
        }

        await sellTransaction(tokenId, priceInWei, amount, balanceCheck.gas, listingPriceInWei);

    }

    return (
        <div>
            <div className="price-overlay hidden" id="popup">
                <div className="price-popup">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        Sell Confirmation
                    </h2>
                    <hr />
                    <div className="mb-4 price-param text-center">
                        <br />
                        <span>
                            NFT Price ( in {NATIVE_TOKEN} )
                        </span>
                        <br />
                        <br />
                        <input
                            type="number"
                            className="form-control price-input"
                            placeholder="Enter sell price in matic"
                            name="price"
                            value={price}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex justify-center">
                        <div className="pr-4">
                            <button
                                className="bg-green-600 hover:bg-green-800 text-white  py-2 px-4 rounded price-button"
                                onClick={handleConfirm}
                            >
                                Confirm
                            </button>
                        </div>
                        <div className="pl-4">
                            <button
                                className="bg-red-600 hover:bg-red-800 text-white  py-2 px-4 rounded price-button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
