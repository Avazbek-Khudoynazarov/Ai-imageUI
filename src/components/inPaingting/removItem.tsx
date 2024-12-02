"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const [isDrawing, setIsDrawing] = useState(false);
  const [originalWidth, setOriginalWidth] = useState<number | null>(null);
  const [originalHeight, setOriginalHeight] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState("Stable Diffusion XL");

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
          const originalWidth = imgElement.naturalWidth;
          const originalHeight = imgElement.naturalHeight;

          setOriginalWidth(originalWidth);
          setOriginalHeight(originalHeight);

          let displayWidth = originalWidth;
          let displayHeight = originalHeight;

          if (originalWidth > 700 || originalHeight > 700) {
            const aspectRatio = originalWidth / originalHeight;
            if (aspectRatio > 1) {
              displayWidth = 700;
              displayHeight = Math.round(700 / aspectRatio);
            } else {
              displayHeight = 700;
              displayWidth = Math.round(700 * aspectRatio);
            }
          }

          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            if (ctx) {
              canvas.width = displayWidth;
              canvas.height = displayHeight;

              ctx.clearRect(0, 0, displayWidth, displayHeight);
              ctx.drawImage(imgElement, 0, 0, displayWidth, displayHeight);
            }
          }
          setImageSrc(reader.result as string);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const processMaskCanvas = (canvas: HTMLCanvasElement): string => {
    const ctx = canvas.getContext("2d");
    if (!ctx || !originalWidth || !originalHeight) {
      throw new Error("Canvas context or original dimensions missing.");
    }

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = originalWidth;
    tempCanvas.height = originalHeight;
    const tempCtx = tempCanvas.getContext("2d");

    if (tempCtx) {
      tempCtx.drawImage(canvas, 0, 0, originalWidth, originalHeight);

      return tempCanvas
        .toDataURL("image/png")
        .replace(/^data:image\/[a-z]+;base64,/, "");
    }
    throw new Error("Failed to process mask canvas.");
  };
  const handleGenerateImage = async () => {
    if (!prompt || !imageSrc || !canvasRef.current) {
      alert("Please upload an image, draw a mask, and enter a prompt!");
      return;
    }

    try {
      const maskCanvas = processMaskCanvas(canvasRef.current);
      const base64Image = imageSrc.replace(/^data:image\/[a-z]+;base64,/, "");

      const payload = {
        prompt: "A description of the image",
        mask: `data:image/png;base64,${maskCanvas}`,
        init_images: [`data:image/png;base64,${base64Image}`],
        sampler_name: "DPM++ SDE Karras",
        steps: 30,
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
      setSelectedModel("Stable Diffusion XL");
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  useEffect(() => {
    setGeneratedImage(null);
  }, []);

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
            className="menu-btn-style"
            id="fade-button"
            aria-controls={open ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            {selectedModel}{" "}
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
            <MenuItem
              onClick={() => {
                setSelectedModel("Stable Diffusion XL");
                handleClose();
              }}
            >
              Stable Diffusion XL
            </MenuItem>
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
          <Button onClick={handleGenerateImage} variant="contained">
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
              width={originalWidth! > 700 ? 700 : originalWidth!}
              height={originalHeight! > 700 ? 700 : originalHeight!}
              objectFit="contain"
            />
            <canvas
              ref={canvasRef}
              width={originalWidth! > 700 ? 700 : originalWidth!}
              height={originalHeight! > 700 ? 700 : originalHeight!}
              style={{
                position: "absolute",
                zIndex: 2,
              }}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onMouseLeave={stopDrawing}
            ></canvas>
          </div>
        )}
        {!imageSrc && !generatedImage && (
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
              src={generatedImage}
              alt="Generated Image"
              width={originalWidth! > 700 ? 700 : originalWidth!}
              height={originalHeight! > 700 ? 700 : originalHeight!}
              objectFit="contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
