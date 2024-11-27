"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import TextField from "@mui/material/TextField";
import { Box, Slider, Typography } from "@mui/material";
import Link from "next/link";
import Fade from "@mui/material/Fade";

import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

import "./css/textToImage.css";
import Image from "next/image";
import axios from "axios";

export default function TextToImage() {
  const [prompt, setPrompt] = useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [count, setCount] = useState(1);
  const [selectedModel, setSelectedModel] = useState("Stable Diffusion XD 2.0");

  const [steps, setSteps] = useState(70);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  console.log("Current Pathname:", pathname);

  const handleWidthChange = (event: Event, newValue: number | number[]) => {
    setWidth(newValue as number);
  };

  const handleHeightChange = (event: Event, newValue: number | number[]) => {
    setHeight(newValue as number);
  };
  const handleCountChange = (event: Event, newValue: number | number[]) => {
    setCount(newValue as number);
  };

  const handleStepsChange = (event: Event, newValue: number | number[]) => {
    setSteps(newValue as number);
  };

  const handleGenerateImage = async () => {
    if (!prompt) {
      alert("Please enter a prompt!");
      return;
    }

    const payload = {
      prompt: `${prompt}, hyper-realistic, ultra-detailed, 8k resolution, photographic quality, highly realistic lighting, accurate textures, intricate details`,
      negative_prompt: `${negativePrompt}, cartoon, anime, blurry, 3d render, painting, unrealistic`,
      sampler_name:
        selectedModel === "Stable Diffusion XL"
          ? "DPM++ SDE Karras"
          : "DPM++ 2M Karras",
      width: width,
      height: height,
      steps: 100,
      cfg_scale: 8,
      n_iter: count,
      batch_size: 1,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://ai.yeongnam.com:7860/sdapi/v1/txt2img",
        payload
      );
      setImages(response.data.images);

      setPrompt("");
      setNegativePrompt("");
      setWidth(512);
      setHeight(512);
      setSteps(70);
      setCount(1);
      setSelectedModel("Stable Diffusion XD 2.0");
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (base64Image: string, index: number): void => {
    const link = document.createElement("a");

    link.download = `generated-image-${index + 1}.png`;

    link.href = `data:image/png;base64,${base64Image}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                setSelectedModel("Stable Diffusion XD 2.0");
                handleClose();
              }}
            >
              Stable Diffusion XD 2.0
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedModel("Stable Diffusion XL");
                handleClose();
              }}
            >
              Stable Diffusion XL
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedModel("Stable Diffusion Lite");
                handleClose();
              }}
            >
              Stable Diffusion Lite
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSelectedModel("Custom Model");
                handleClose();
              }}
            >
              Custom Model
            </MenuItem>
          </Menu>
        </div>
        <div className="prompt-input">
          <span className="title-span-style">Prompt</span>
          <TextField
            className="input-style-fix"
            placeholder="e.g. A cat is sitting on a table"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
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
                  opacity: 100,
                  fontWeight: 600,
                },
              },
            }}
          />
        </div>
        <div className="prompt-input">
          <span className="title-span-style">Negative Prompt</span>
          <TextField
            className="input-style-fix"
            placeholder="e.g. blurry, distorted"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{ display: "flex", width: "50px" }}
              >
                Width
              </Typography>
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
              <Box className="slider-size-displayer">
                <span>{width}</span>
                <span>px</span>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body1"
                sx={{ display: "flex", width: "50px" }}
              >
                Height
              </Typography>
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
              <Box className="slider-size-displayer">
                {" "}
                <span>{height}</span>
                <span>px</span>
              </Box>
            </Box>
          </Box>
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "10px",
            }}
          >
            <Typography variant="body1" sx={{ display: "flex", width: "auto" }}>
              Number of Images
            </Typography>
            <Box className="slider-size-displayer">
              <span>{count}</span>
            </Box>
          </Box>
          <Box>
            <Slider
              value={count}
              onChange={handleCountChange}
              min={1}
              max={20}
              step={1}
              className="slider-size-style2"
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
          </Box>
        </Box>
        <div className="btn-create">
          <button onClick={handleGenerateImage}>
            {isLoading ? "Generating..." : "Create"}
          </button>
        </div>
      </div>
      <div className="image-board">
        {images.map((src, index) => (
          <div className="card" key={index}>
            <Image
              width={256}
              height={256}
              src={`data:image/png;base64,${src}`}
              alt={`Generated Image ${index + 1}`}
              draggable={false}
            />

            <div className="icon-container">
              <div className="icons-down-star-trash-size">
                <Image
                  src="/assets/home/star.svg"
                  alt="star icon"
                  width={20}
                  height={20}
                  draggable={false}
                  className="icon"
                />
              </div>
              <div
                onClick={() => handleDownload(src, index)}
                className="icons-down-star-trash-size"
              >
                <Image
                  src="/assets/home/down.svg"
                  alt="download icon"
                  width={20}
                  height={20}
                  draggable={false}
                  className="icon"
                />
              </div>
              <div className="icons-down-star-trash-size">
                <Image
                  src="/assets/home/trash.svg"
                  alt="trash icon"
                  width={20}
                  height={24}
                  draggable={false}
                  className="icon"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
