"use client";

import React, { useState } from "react";
import "../home/css/pricing.css";

export default function PricingPage() {
  const [activeButton, setActiveButton] = useState("Monthly");

  const handleClick = (button: any) => {
    setActiveButton(button);
  };
  return (
    <div className="pricing-main">
      <div className="btn-monthly-yearly">
        <button
          onClick={() => handleClick("Monthly")}
          style={{
            backgroundColor:
              activeButton === "Monthly" ? "#F5F5F5" : "transparent",
          }}
        >
          Monthly
        </button>
        <button
          onClick={() => handleClick("Yearly")}
          style={{
            backgroundColor:
              activeButton === "Yearly" ? "#F5F5F5" : "transparent",
          }}
        >
          Yearly
        </button>
      </div>
      <div className="pricing-card-main-container">
        <div className="pricing-card">
          <div className="pricing-title">
            <span>Starter</span>
            <div className="price-real">
              <h1>FREE</h1>
            </div>
          </div>
          <div className="pricing-features">
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
          </div>
          <div className="btn-main-pricing">
            <button className="pricing-btn">Button</button>
          </div>
        </div>
        <div className="pricing-card">
          <div className="pricing-title">
            <span>Basic</span>
            <div className="price-real">
              <span className="dollar-symbol">&#36;</span>
              <h1>7</h1>
              <span className="per-month">/mo</span>
            </div>
          </div>
          <div className="pricing-features">
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
          </div>
          <div className="btn-main-pricing">
            <button className="pricing-btn">Button</button>
          </div>
        </div>
        <div className="pricing-card">
          <div className="pricing-title">
            <span>Professional</span>
            <div className="price-real">
              <span className="dollar-symbol">&#36;</span>
              <h1>20</h1>
              <span className="per-month">/mo</span>
            </div>
          </div>
          <div className="pricing-features">
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
            <div>
              <b>&#x2022;</b> List Item
            </div>
          </div>
          <div className="btn-main-pricing">
            <button className="pricing-btn">Button</button>
          </div>
        </div>
      </div>
    </div>
  );
}
