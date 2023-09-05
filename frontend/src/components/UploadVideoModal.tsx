import { darken, lighten, transparentize } from "polished";
import { createPortal } from "react-dom";
import { keyframes, styled } from "styled-components";
import { RxCross2 } from "react-icons/rx";
import { LiaFileVideoSolid } from "react-icons/lia";
import { CiImageOn } from "react-icons/ci";
import { MdMovie } from "react-icons/md";
import { useState } from "react";
import api from "../api";

const blink = (theme: any) => keyframes`
from {
  color: ${theme.colors.primary};
} to {
  color: ${theme.colors.quaternary};
}
`;

const appear = keyframes`
0% {
  transform: translate(-50%, -50%) scale(0.5);
} 100% {
  transform: translate(-50%, -50%) scale(1);
}
`;

const StyledBackground = styled.div`
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(1px);
`;

const StyledModal = styled.div`
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 10px;
  width: ${({ theme }) => theme.modal.width};
  animation: ${appear} 250ms both ease;
  background: ${({ theme }) =>
    theme.theme === "light"
      ? theme.colors.background
      : lighten(0.1, theme.colors.background)};
  box-shadow: 0 5px 15px
    ${({ theme }) =>
      theme.theme === "light"
        ? darken(0.25, theme.colors.background)
        : lighten(0.25, theme.colors.background)};

  h1 {
    font-size: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: unset;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid
      ${({ theme }) =>
        theme.theme === "light"
          ? darken(0.25, theme.colors.background)
          : lighten(0.25, theme.colors.background)};

    button {
      all: unset;
      cursor: pointer;
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: 2rem;
      transition: background 300ms;

      &:hover {
        background: ${({ theme }) =>
          theme.theme === "light"
            ? darken(0.25, theme.colors.background)
            : lighten(0.25, theme.colors.background)};
      }
    }
  }

  progress {
    appearance: none;
    -webkit-appearance: none;
    height: 10px;

    &::-webkit-progress-value {
      background: ${({ theme }) => theme.colors.quaternary};
      border-radius: 15px;
    }

    &::-webkit-progress-bar {
      border-radius: 15px;
      background: ${({ theme }) =>
        theme.theme === "light"
          ? darken(0.1, theme.colors.background)
          : lighten(0.2, theme.colors.background)};
    }
  }

  form {
    padding: 0 1.5rem 1.5rem;

    & > div {
      display: flex;
      flex-direction: column;
      margin-top: 1rem;

      &:first-of-type {
        gap: 0.5rem;
      }
    }

    label {
      font-size: 1.125rem;
    }

    input {
      outline: unset;
      background: transparent;
      border: 1px solid
        ${({ theme }) =>
          theme.theme === "light"
            ? darken(0.25, theme.colors.background)
            : lighten(0.25, theme.colors.background)};

      &[type="text"] {
        padding: 0.75rem 1rem;
        border-radius: 5px;
        transition: border 250ms;
        color: ${({ theme }) =>
          theme.theme === "light"
            ? darken(0.25, theme.colors.primary)
            : lighten(0.25, theme.colors.primary)};

        &:focus {
          border: 1px solid
            ${({ theme }) =>
              theme.theme === "light"
                ? darken(0.5, theme.colors.background)
                : lighten(0.5, theme.colors.background)};
        }
      }
    }

    .file {
      border: 1px solid
        ${({ theme }) =>
          theme.theme === "light"
            ? darken(0.75, theme.colors.background)
            : lighten(0.75, theme.colors.background)};
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
      padding: 0.5rem 0;

      * {
        cursor: pointer;
        text-align: center;
      }

      input {
        display: none;
      }

      .icon {
        font-size: 3rem;
      }
    }
  }

  button[disabled] {
    outline: none !important;
    color: ${({ theme }) => theme.colors.primary} !important;
    background: ${({ theme }) => theme.colors.background} !important;
  }

  .blink {
    animation: ${({ theme }) => blink(theme)} 250ms 6 alternate;
  }

  .buttons {
    flex-direction: row;
    margin-top: 2rem;
    gap: 1rem;

    button {
      all: unset;
      cursor: pointer;
      flex-grow: 1;
      text-align: center;
      border-radius: 5px;
      padding: 12px 2rem;
      font-size: 1.1rem;
      transition: outline 500ms, background 500ms, color 500ms;

      &:first-of-type {
        outline: 1px solid ${({ theme }) => theme.colors.quaternary};

        &:hover {
          outline: none;
          background: ${({ theme }) => theme.colors.quaternary};
          color: ${({ theme }) => theme.colors.opposite};
        }
      }

      &:last-of-type {
        background: ${({ theme }) => theme.colors.quaternary};
        color: ${({ theme }) => theme.colors.opposite};

        &:hover {
          outline: 1px solid ${({ theme }) => theme.colors.quaternary};
          background: transparent;
          color: ${({ theme }) => theme.colors.primary};
        }
      }
    }
  }

  .video {
    display: flex;
    gap: 1rem;
    padding: 5px 1rem;

    &__size {
      font-size: 0.75rem;
      color: ${({ theme }) => transparentize(0.25, theme.colors.primary)};
    }

    &__upload {
      display: flex;
      align-items: center;
      gap: 1rem;

      progress {
        flex-grow: 1;
      }

      span {
        transform: translateY(-2px);
      }
    }

    & > div:first-of-type {
      font-size: 2rem;
      padding: 0 10px;
      height: 3rem;
      display: grid;
      place-items: center;
      border-radius: 10px;
      border: 1px solid
        ${({ theme }) =>
          theme.theme === "light"
            ? darken(0.35, theme.colors.background)
            : lighten(0.35, theme.colors.background)};
    }

    & > div:last-of-type {
      flex-grow: 1;
      display: flex;
      flex-direction: column;

      * {
        text-align: left;
      }
    }
  }
`;

export default function UploadVideoModal({ onClose }: { onClose: () => void }) {
  const [coverImage, setCoverImage] = useState("");
  const [videoFile, setVideoFile] = useState<{
    name: string;
    size: string;
  } | null>(null);
  const [upload, setUpload] = useState<{
    started: boolean;
    progress: number;
    total: number;
  } | null>(null);

  const container = document.querySelector("#modal-portal")!;

  const formOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const token = localStorage.getItem("token");
    const formData = new FormData(e.currentTarget);

    if (!form.cover.value) {
      const coverInput = form.querySelector("#cover")!;
      coverInput.classList.remove("blink");
      setTimeout(() => {
        coverInput.classList.add("blink");
      }, 0);
      return;
    }

    const videoInput = form.video as HTMLInputElement;
    if (!videoInput.value) {
      const videoInput = form.querySelector("#video")!;
      videoInput.classList.remove("blink");
      setTimeout(() => {
        videoInput.classList.add("blink");
      }, 0);
      return;
    }

    const buttons = form.querySelectorAll("button");
    for (let button of buttons) {
      button.disabled = true;
    }

    api
      .post("/video", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress(e) {
          setUpload((upload) => {
            if (upload) {
              return {
                started: true,
                progress: e.loaded > upload.total ? upload.total : e.loaded,
                total: upload.total,
              };
            }

            return null;
          });
        },
      })
      .then(() => {
        onClose();
      })
      .catch((e) => console.error(e));
  };

  const inputContainerOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const input = e.currentTarget.querySelector("input") as HTMLInputElement;
    input.click();
  };

  const clampName = (name: string) =>
    name.length > 64 ? name.slice(0, 64) + "..." : name;

  return createPortal(
    <>
      <StyledBackground onClick={onClose} />
      <StyledModal>
        <h1>
          <span>Upload your Video</span>
          {!upload && (
            <button onClick={onClose}>
              <RxCross2 />
            </button>
          )}
        </h1>
        <form onSubmit={formOnSubmit}>
          <div>
            <label htmlFor="video-title">Enter video title</label>
            <input
              required
              type="text"
              placeholder="Video title"
              name="title"
              id="video-title"
            />
          </div>
          <div
            id="cover"
            className="file"
            style={{
              borderStyle: coverImage ? "solid" : "dashed",
            }}
            onClick={inputContainerOnClick}
          >
            {coverImage ? (
              <span>{coverImage}</span>
            ) : (
              <>
                <div className="icon">
                  <CiImageOn />
                </div>
                <label htmlFor="cover-image">Select cover image</label>
              </>
            )}
            <input
              onChange={(e) => {
                const files = e.currentTarget.files;
                if (files && files.length > 0) {
                  setCoverImage(clampName(files[0].name));
                }
              }}
              type="file"
              accept="image/*"
              name="cover"
              id="cover-image"
            />
          </div>
          <div
            id="video"
            className="file"
            style={{
              borderStyle: videoFile ? "solid" : "dashed",
            }}
            onClick={inputContainerOnClick}
          >
            {videoFile ? (
              <div className="video">
                <div>
                  <MdMovie />
                </div>
                <div>
                  <span>{videoFile.name}</span>
                  <span className="video__size">{videoFile.size}</span>
                  {upload && upload.started && (
                    <div className="video__upload">
                      <progress
                        value={upload.progress}
                        max={upload.total}
                      ></progress>
                      <span>
                        {Math.round((100 * upload.progress) / upload.total)} %
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="icon">
                  <LiaFileVideoSolid />
                </div>
                <label htmlFor="file-input">Select video file</label>
              </>
            )}
            <input
              onChange={(e) => {
                const files = e.currentTarget.files;
                if (files && files.length > 0) {
                  let videoSize: string;
                  const size = files[0].size;

                  if (size >= 1000 * 1_000_000) {
                    // Go
                    videoSize = `${Math.round(size / 1_000_000_000)} GB`;
                  } else if (size >= 1_000_000) {
                    // Mo
                    videoSize = `${Math.round(size / 1_000_000)} MB`;
                  } else if (size >= 1000) {
                    // Ko
                    videoSize = `${Math.round(size / 1_000)} KB`;
                  } else {
                    videoSize = `${size} Bytes`;
                  }

                  setUpload({
                    started: false,
                    progress: 0,
                    total: size,
                  });

                  setVideoFile({
                    name: clampName(files[0].name),
                    size: videoSize,
                  });
                }
              }}
              type="file"
              name="video"
              id="file-input"
              accept="video/*"
            />
          </div>
          <div className="buttons">
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </button>
            <button>Import</button>
          </div>
        </form>
      </StyledModal>
    </>,
    container
  );
}
