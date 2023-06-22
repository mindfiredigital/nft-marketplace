import './Footer.css';

function Footer() {
    return (
        <div className="footer flex flex-row justify-center pb-5 pt-6 bg-black text-white sm: pl-4 pr-4 pt-10 md:pt-10">
            <div className="basis-1/1 text-center">
                <span className="text-sm font-light">
                    Copyright © 2023 Fandom | NFT Marketplace. Designed and Developed by <b>Mindfire Digital</b>
                </span>
            </div>
            <hr />
        </div>
    );
}

export default Footer;
