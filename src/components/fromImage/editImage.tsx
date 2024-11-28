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

export default function EditImage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [width, setWidth] = useState<number>(1024);
  const [height, setHeight] = useState<number>(1024);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedModel, setSelectedModel] = useState("Stable Diffusion XL");
  const pathname = usePathname();
  const handleWidthChange = (event: Event, newValue: number | number[]) => {
    setWidth(newValue as number);
  };

  const handleHeightChange = (event: Event, newValue: number | number[]) => {
    setHeight(newValue as number);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  const handleGenerateSVG = async () => {
    if (!prompt) {
      alert("Please enter a prompt!");
      return;
    }

    if (!imageSrc) {
      alert("Please upload an image to use as a background!");
      return;
    }

    try {
      const base64Image = imageSrc.replace(/^data:image\/[a-z]+;base64,/, "");

      const payload = {
        prompt: `${prompt}, hyper-realistic, ultra-detailed, photo-realistic, natural lighting, high resolution, accurate textures, professional photography, cinematic`,
        negative_prompt:
          "cartoon, anime, low quality, blurry, 3D render, unrealistic, painting",
        sampler_name:
          selectedModel === "Stable Diffusion XL"
            ? "DPM++ SDE Karras"
            : "DPM++ 2M Karras",
        batch_size: 1,
        n_iter: 1,
        steps: 30,
        cfg_scale: 12,
        width: width,
        height: height,
        init_images: [`data:image/png;base64,${base64Image}`],
      };

      setIsLoading(true);

      const response = await axios.post(
        "https://ai.yeongnam.com/sdapi/v1/img2img",
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
      setSelectedModel("Stable Diffusion XL");
      setWidth(1024);
      setHeight(1024);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error generating PNG:", error.message);
        alert(`Failed to generate the PNG image. Error: ${error.message}`);
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
            placeholder="Describe the image (e.g., 'A cat next to a table')"
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
            placeholder="Negative Prompt"
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
                  fontWeight: 600,
                  opacity: 100,
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
                  min={256}
                  max={2048}
                  step={256}
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
                    min={256}
                    max={2048}
                    step={256}
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
          <Button
            onClick={handleGenerateSVG}
            variant="contained"
            sx={{
              backgroundColor: "#00504B",
              color: "#fff",
              marginTop: "20px",
            }}
          >
            {isLoading ? "Generating..." : "Generate"}
          </Button>
          <button>2 credits will be charged</button>
        </div>
      </div>
      <div
        className="image-board"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {imageSrc ? (
          <div className="image-preview" style={{ position: "relative" }}>
            {/* Background Image */}
            <Image
              width={700}
              height={700}
              src={imageSrc}
              alt="Uploaded"
              className="uploaded-image"
              draggable={false}
              style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
            />
            {/* Generated Image */}
            {generatedImage && (
              <Image
                src={generatedImage}
                alt="Generated Content"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  zIndex: 2,
                }}
                width={700}
                height={700}
                draggable={false}
              />
            )}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
