"use client";

import React, { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import TextField from "@mui/material/TextField";
import { Box, Slider, Typography } from "@mui/material";
import Link from "next/link";
import axios from "axios";

import "../home/css/textToImage.css";
import Image from "next/image";

export default function RemoveItem() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const pathname = usePathname();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [maskSrc, setMaskSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [width, setWidth] = useState<number>(1024);
  const [height, setHeight] = useState<number>(1024);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleWidthChange = (event: Event, newValue: number | number[]) => {
    setWidth(newValue as number);
  };

  const handleHeightChange = (event: Event, newValue: number | number[]) => {
    setHeight(newValue as number);
  };
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
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
        // console.log(`Drawing at: (${x}, ${y})`);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 10);
        ctx.fill();
      } else {
        console.error("Canvas context is not available.");
      }
    } else {
      console.error("Canvas element is not available.");
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt || !imageSrc || !canvasRef.current) {
      alert("Please upload an image, draw a mask, and enter a prompt!");
      return;
    }

    const maskCanvas = canvasRef.current
      .toDataURL("image/png")
      .replace(/^data:image\/[a-z]+;base64,/, "");

    console.log("Mask Base64 String:", maskCanvas);

    try {
      const base64Image = imageSrc.replace(/^data:image\/[a-z]+;base64,/, "");

      const payload = {
        prompt: `${prompt}, hyper-realistic, ultra-detailed, photo-realistic, natural lighting, high resolution, accurate textures, professional photography, cinematic`,
        negative_prompt: "cartoon, blurry, 3D render, unrealistic",
        sampler_name: "Euler a",
        width: width,
        height: height,
        steps: 50,
        cfg_scale: 12,
        mask: maskCanvas,
        inpainting_fill: 1,
        inpaint_full_res: true,
        inpainting_mask_invert: 0,
        init_images: [`data:image/png;base64,${base64Image}`],
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
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error generating image:", error.message, error.stack);
        alert(
          `Failed to generate the image. Please try again. ${error.message}`
        );
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again.");
      }
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
            Stable Diffusion XD 2.0{" "}
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
        <div className="slider-image-size">
          <span className="title-span-style">Output Size</span>
          <Box className="main-slider-image">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 15,
                marginBottom: "15px",
              }}
            >
              <Typography variant="body1" sx={{ paddingRight: "5px" }}>
                Width
              </Typography>
              <div>
                <Slider
                  value={width}
                  onChange={handleWidthChange}
                  min={0}
                  max={2000}
                  className="slider-size-style"
                  sx={{
                    color: "#2f7367",
                    "& .MuiSlider-track": {
                      height: 16,
                      borderRadius: 4,
                    },
                    "& .MuiSlider-rail": {
                      height: 16,
                      borderRadius: 4,
                      backgroundColor: "#bbd5d1",
                    },
                    "& .MuiSlider-thumb": {
                      zIndex: 99,
                    },
                  }}
                />
              </div>
              <Box className="slider-size-displayer">
                <span>{width}</span>
                <span>px</span>
              </Box>
            </div>
            <Box className="main-slider-image">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 15,
                  marginBottom: "15px",
                }}
              >
                <Typography variant="body1">Height</Typography>
                <div>
                  <Slider
                    value={height}
                    onChange={handleHeightChange}
                    min={0}
                    max={2000}
                    className="slider-size-style"
                    sx={{
                      color: "#2f7367",
                      "& .MuiSlider-track": {
                        height: 16,
                        borderRadius: 4,
                      },
                      "& .MuiSlider-rail": {
                        height: 16,
                        borderRadius: 4,
                        backgroundColor: "#bbd5d1",
                      },
                      "& .MuiSlider-thumb": {
                        zIndex: 99,
                      },
                    }}
                  />
                </div>
                <Box className="slider-size-displayer">
                  {" "}
                  <span>{height}</span>
                  <span>px</span>
                </Box>
              </div>
            </Box>
          </Box>
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
            />
            <canvas
              ref={canvasRef}
              width={700}
              height={700}
              style={{
                position: "absolute",
                top: "12%",
                zIndex: 2,
                backgroundColor: "transparent",
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
          <div>
            <Image
              width={700}
              height={700}
              src={generatedImage}
              alt="Generated"
              style={{ marginTop: "20px" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
