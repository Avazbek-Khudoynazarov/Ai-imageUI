"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import "./css/navbar.css";
import Image from "next/image";

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
        <Link href={"/"}>
          <Image
            src="./assets/home/yeongnamLogo.svg"
            alt="Logo"
            draggable={false}
            width={105}
            height={40}
          />
        </Link>
      </div>
      <div className="user-icon-price-link">
        <Link className="pricing-link" href={"/pricing"}>
          Pricing
        </Link>
        <Image
          width={40}
          height={40}
          src="./assets/home/userLogo.svg"
          alt="User Logo"
          className="user-logo"
          draggable={false}
        />
      </div>
    </div>
  );
}
