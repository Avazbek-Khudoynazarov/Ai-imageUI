import React from "react";
import Navbar from "../home/navbar";
import Footer from "../home/footer";
import EditImage from "./editImage";

export default function AiImage() {
  return (
    <div>
      <Navbar />

      <EditImage />
      <Footer />
    </div>
  );
}
