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
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

import "./css/textToImage.css";
import Image from "next/image";

export default function TextToImage() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [number, setNumber] = useState(0);
  const pathname = usePathname();

  console.log("Current Pathname:", pathname);

  const handleWidthChange = (event: Event, newValue: number | number[]) => {
    setWidth(newValue as number);
  };

  const handleHeightChange = (event: Event, newValue: number | number[]) => {
    setHeight(newValue as number);
  };
  const handleNumberChange = (event: Event, newValue: number | number[]) => {
    setNumber(newValue as number);
  };
  const images = Array(4).fill("./assets/home/girl.svg");

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
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button
                  className=" menu-btn-style"
                  variant="contained"
                  {...bindTrigger(popupState)}
                >
                  Stable Diffusion XD 2.0
                  <ArrowDropDownRoundedIcon
                    fontSize="large"
                    sx={{ color: "#00504B" }}
                  />
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <MenuItem onClick={popupState.close}>
                    Stable Diffusion XD 2.0
                  </MenuItem>
                  <MenuItem onClick={popupState.close}>
                    Stable Diffusion XD 2.1
                  </MenuItem>
                  <MenuItem onClick={popupState.close}>
                    Stable Diffusion XL
                  </MenuItem>
                  <MenuItem onClick={popupState.close}>
                    Stable Diffusion Lite
                  </MenuItem>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
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
        <div className="number-of-image-container">
          <div className="tit-num-style">
            <span className="title-span-style">Number of Images</span>
            <Box className="slider-number-of-images">
              <span>{number}</span>
            </Box>
          </div>
          <div className="num-image-slider-custom">
            <Slider
              value={number}
              onChange={handleNumberChange}
              min={0}
              max={2000}
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
          </div>
        </div>
        <div className="btn-create">
          <button>Create</button>
          <button>2 credits will be charged</button>
        </div>
      </div>
      <div className="image-board">
        {images.map((src, index) => (
          <div className="card" key={index}>
            <div className="icons-down-star-trash">
              <div className="icons-down-star-trash-size">
                <Image
                  width={24}
                  height={24}
                  src="./assets/home/star.svg"
                  alt="like-icon"
                  draggable={false}
                />
              </div>
              <div className="icons-down-star-trash-size">
                <Image
                  width={24}
                  height={24}
                  src="./assets/home/down.svg"
                  alt="download-icon"
                  draggable={false}
                />
              </div>
              <div className="icons-down-star-trash-size">
                <Image
                  width={24}
                  height={24}
                  src="./assets/home/trash.svg"
                  alt="delete-icon"
                  draggable={false}
                />
              </div>
            </div>
            <Image
              width={256}
              height={256}
              src={src}
              alt={`Image ${index + 1}`}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
