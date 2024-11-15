import React from "react";
import TextToImage from "./textToImage";
import Navbar from "./navbar";
import Footer from "./footer";

const HomePage = async () => {
  return (
    <div>
      <Navbar />
      <TextToImage />
      <Footer />
    </div>
  );
};

export default HomePage;
