import './Footer.css';

function Footer() {
    return (
        <div className="footer flex flex-row justify-center py-6 bg-black text-white">
            <div className="basis-1/1 text-center">
                <span className="text-sm font-light">
                    Copyright © 2023 Fandom | NFT Marketplace. Designed by <b>Mindfire</b>
                </span>
            </div>
            <hr />
        </div>
    );
}

export default Footer;
