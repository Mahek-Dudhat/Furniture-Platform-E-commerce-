import { Outlet, useNavigation } from "react-router-dom";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import MiniCart from "../common/MiniCart";



function AppLayout() {

    

 //   console.log('lsLogin:', isLoginOpen);

    return (
        <>
            <Header />
             
            <Outlet />
           
            <Footer />

            <MiniCart />
        </>
    )
}

export default AppLayout
