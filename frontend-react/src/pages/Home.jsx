import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Home.css';
import BlogPreview from "../components/layouts/HomeLayout/BlogPreview";
import CollectionsSection from "../components/layouts/HomeLayout/CollectionsSection";
import CustomerFavourite from "../components/layouts/HomeLayout/CustomerFavourite";
import NewArrival from "../components/layouts/HomeLayout/NewArrival";
import TrustSignals from "../components/layouts/HomeLayout/TrustSignals";
import Newsletter from "../components/layouts/HomeLayout/Newsletter";
import HeroSlider from "../components/ui/HeroSlider";
import { useAuth } from '../context/AuthContext';

function Home() {
  const location = useLocation();
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (location.state?.showWelcome && user) {
      setShowWelcome(true);
      setTimeout(() => setShowWelcome(false), 2000);
      window.history.replaceState({}, document.title);
    }
  }, [location, user]);

  return (
    <>
      {showWelcome && (
        <div className="welcome-popup">
          Welcome back, {user?.fullname || user?.email}!
        </div>
      )}
      <HeroSlider />
      <CustomerFavourite />
      <CollectionsSection />
      <NewArrival />
      <TrustSignals />
      <BlogPreview />
      <Newsletter />
    </>
  )
}

export default Home;
