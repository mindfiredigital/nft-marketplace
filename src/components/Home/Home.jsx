import Footer from '../Footer/Footer';
import Header from "../Header/Header";
import image from "../../assets/robo.png";
import {
  Button
} from "@material-tailwind/react";
import './Home.css';

function Home() {
  return (
    <div className="Home h-screen relative md:h-auto">
      <div class="grid md:grid-cols-2 gap-3 items-center p-8">
        <div>
          <h1 className="font-bold text-4xl md:text-6xl">Discover and collect your favourite digital NTFs</h1>
          <br />
          <Button variant="gradient" size="sm" fullWidth
            className="connect-wallet-btn md:inline
            mb-2 hover:text-black focus:text-black active:text-black">
            <span>Connect Wallet</span>
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
