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

import "../home/css/textToImage.css";

export default function EditImage() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const pathname = usePathname();
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

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

  return (
    <div className="image-editor-main">
      <div className="menu-nav-link">
        <div className={`from-text-page ${pathname === "/" ? "active" : ""}`}>
          <Link href="/" className="main-link-to-pages">
            <img
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
            <img
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
            <img
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
          <button>Create</button>
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
          <div className="image-preview">
            <img
              src={imageSrc}
              alt="Uploaded"
              className="uploaded-image"
              draggable={false}
            />
          </div>
        ) : (
          <div className="upload-image">
            <span>CLICK TO ADD IMAGE</span>
            <button onClick={handleButtonClick}>
              <img
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
