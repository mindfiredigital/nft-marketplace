import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function App() {
    return (
        <div>
            <Header />
            <div className="min-h-[calc(100vh-164px)]">
                <Outlet />
            </div>
            <div className="bottom-0 absolute md:relative">
                <Footer />
            </div>
        </div>
    );
}

export default App;
