"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";

import "./css/navbar.css";

export default function Navbar() {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`navbar-main ${isFixed ? "fixed" : ""}`}>
      <div className="yeongnam-logo-container">
        {/* <MenuIcon className="menu-icon" /> */}
        <Link href={"/"}>
          <img
            src="./assets/home/yeongnamLogo.svg"
            alt="Logo"
            draggable={false}
          />
        </Link>
      </div>
      <div className="user-icon-price-link">
        <Link className="pricing-link" href={"/pricing"}>
          Pricing
        </Link>
        <img
          src="./assets/home/userLogo.svg"
          alt="User Logo"
          className="user-logo"
          draggable={false}
        />
      </div>
    </div>
  );
}
