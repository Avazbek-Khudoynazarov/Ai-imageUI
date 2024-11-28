"use client";

import React, { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";

import "../home/css/textToImage.css";

export default function RemoveItem() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const pathname = usePathname();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState<number>(1024);
  const [height, setHeight] = useState<number>(1024);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imgElement = new window.Image();
        imgElement.src = reader.result as string;
        imgElement.onload = () => {
          if (canvasRef.current) {
            canvasRef.current.width = imgElement.naturalWidth;
            canvasRef.current.height = imgElement.naturalHeight;
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              ctx.clearRect(
                0,
                0,
                imgElement.naturalWidth,
                imgElement.naturalHeight
              );
            }
          }
          setWidth(imgElement.naturalWidth);
          setHeight(imgElement.naturalHeight);
          setImageSrc(reader.result as string);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        console.log(`Drawing at: (${x}, ${y})`);
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const processMaskCanvas = (canvas: HTMLCanvasElement): string => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D context from canvas.");
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = data.slice(i, i + 3);

      if (r > 0 || g > 0 || b > 0) {
        data[i] = 255; // Red
        data[i + 1] = 255; // Green
        data[i + 2] = 255; // Blue
        data[i + 3] = 255; // Alpha
      } else {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 0; // Fully transparent
      }
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas
      .toDataURL("image/png")
      .replace(/^data:image\/[a-z]+;base64,/, "");
  };

  const handleGenerateImage = async () => {
    if (!prompt || !imageSrc || !canvasRef.current) {
      alert("Please upload an image, draw a mask, and enter a prompt!");
      return;
    }

    const maskCanvas = processMaskCanvas(canvasRef.current);

    try {
      const base64Image = imageSrc.replace(/^data:image\/[a-z]+;base64,/, "");

      const payload = {
        prompt,
        mask: `data:image/png;base64,${maskCanvas}`,
        init_images: [`data:image/png;base64,${base64Image}`],
        width,
        height,
        sampler_name: "Euler a",
        steps: 50,
        cfg_scale: 12,
      };

      setIsLoading(true);
      const response = await axios.post(
        "http://ai.yeongnam.com:7860/sdapi/v1/img2img",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.images) {
        setGeneratedImage(`data:image/png;base64,${response.data.images[0]}`);
        setImageSrc(null);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="image-editor-main">
      <div className="menu-nav-link">
        <div className={`from-text-page ${pathname === "/" ? "active" : ""}`}>
          <Link href="/" className="main-link-to-pages">
            <Image
              width={24}
              height={24}
              src="./assets/home/Tt.svg"
              alt="From Text Icon"
              draggable={false}
            />
            <span>
              From <br /> Text
            </span>
          </Link>
        </div>

        <div
          className={`from-text-page ${
            pathname === "/from-image" ? "active" : ""
          }`}
        >
          <Link href="/from-image" className="main-link-to-pages">
            <Image
              width={24}
              height={24}
              src="./assets/home/fromImage.svg"
              alt="From Image Icon"
              draggable={false}
            />
            <span>
              From <br /> Image
            </span>
          </Link>
        </div>

        <div
          className={`from-text-page ${
            pathname === "/in-painting" ? "active" : ""
          }`}
        >
          <Link href="/in-painting" className="main-link-to-pages">
            <Image
              width={24}
              height={24}
              src="./assets/home/inPainting.svg"
              alt="In Painting Icon"
              style={{ width: "30px", height: "30px" }}
              draggable={false}
            />
            <span>
              In <br /> Painting
            </span>
          </Link>
        </div>
      </div>
      <div className="editor-toolbar">
        <div className="create-from-text">
          <span className="title-span-style">Create from text</span>
        </div>
        <div className="model-menu-position">
          <span className="title-span-style">Model</span>
          <Button
            className=" menu-btn-style"
            id="fade-button"
            aria-controls={open ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            Stable Diffusion XD 2.0
            <ArrowDropDownRoundedIcon
              fontSize="large"
              sx={{ color: "#00504B" }}
            />
          </Button>
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </div>
        <div className="prompt-input">
          <span className="title-span-style">Prompt</span>
          <TextField
            className="input-style-fix"
            placeholder="Please Describe what to do"
            variant="outlined"
            fullWidth
            multiline
            minRows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{
              backgroundColor: "#d8f1f1",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent",
                },
                "& textarea::placeholder": {
                  color: "#324B49",
                  fontWeight: 600,
                  opacity: 100,
                },
              },
            }}
          />
        </div>
        <div className="prompt-input">
          <span className="title-span-style">Negative Prompt</span>
          <TextField
            className="input-style-fix"
            placeholder="e.g. A cat is sitting on a table"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            sx={{
              backgroundColor: "#d8f1f1",
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent",
                },
                "& textarea::placeholder": {
                  color: "#324B49",
                  opacity: 100,
                  fontWeight: 600,
                },
              },
            }}
          />
        </div>

        <div
          style={{
            height: "230px",
            justifyContent: "flex-end",
            paddingBottom: "20px",
          }}
          className="btn-create"
        >
          <Button onClick={handleGenerateImage} disabled={isLoading}>
            {isLoading ? "Processing..." : "Generate"}
          </Button>
          <button>2 credits will be charged</button>
        </div>
      </div>
      <div className="image-board" style={{ position: "relative" }}>
        {imageSrc && (
          <div
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={imageSrc}
              alt="Uploaded"
              style={{
                zIndex: 1,
              }}
              width={700}
              height={700}
              objectFit="100%"
            />
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              style={{
                position: "absolute",
                zIndex: 2,
                backgroundColor: "transparent",
                border: "2px solid yellow",
              }}
              onMouseDown={handleCanvasDrawing}
              onMouseMove={(e) => {
                if (e.buttons === 1) handleCanvasDrawing(e);
              }}
            />
          </div>
        )}
        {!imageSrc && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div className="upload-image">
              <span>CLICK TO ADD IMAGE</span>
              <button onClick={handleButtonClick}>
                <Image
                  width={67}
                  height={67}
                  src="./assets/fromImage/upload.svg"
                  alt="Upload icon"
                  draggable={false}
                />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          </div>
        )}
        {generatedImage && (
          <Image
            src={generatedImage}
            alt="Generated Image"
            width={700} // Use the width from the state
            height={700} // Use the height from the state
            style={{
              marginTop: "20px",
            }}
            objectFit="100%"
          />
        )}
      </div>
    </div>
  );
}
