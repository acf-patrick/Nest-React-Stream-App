import { darken, lighten } from "polished";
import { createPortal } from "react-dom";
import { styled } from "styled-components";
import { RxCross2 } from "react-icons/rx";
import { LiaFileVideoSolid } from "react-icons/lia";
import { CiImageOn } from "react-icons/ci";
import api from "../api";

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
  transform: translate(-50%, -50%);
  width: ${({ theme }) => theme.modal.width};
  background: ${({ theme }) =>
    theme.theme === "light"
      ? darken(0.1, theme.colors.background)
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
      border: 1px dashed
        ${({ theme }) =>
          theme.theme === "light"
            ? darken(0.75, theme.colors.background)
            : lighten(0.75, theme.colors.background)};
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0.5rem 0;

      * {
        cursor: pointer;
      }

      input {
        display: none;
      }

      .icon {
        font-size: 3rem;
      }
    }

    .buttons {
      flex-direction: row;
      justify-content: flex-end;
    }
  }
`;

export default function UploadVideoModal({ onClose }: { onClose: () => void }) {
  const container = document.querySelector("#modal-portal")!;

  const formOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const inputContainerOnClick = (e: React.MouseEvent<HTMLDivElement>) => {

  }

  return createPortal(
    <>
      <StyledBackground onClick={onClose} />
      <StyledModal>
        <h1>
          <span>Upload your Video</span>
          <button onClick={onClose}>
            <RxCross2 />
          </button>
        </h1>
        <form onSubmit={formOnSubmit}>
          <div>
            <label htmlFor="video-title">Enter video title</label>
            <input
              type="text"
              placeholder="Video title"
              name="video-title"
              id="video-title"
            />
          </div>
          <div className="file" onClick={inputContainerOnClick}>
            <div className="icon">
              <LiaFileVideoSolid />
            </div>
            <label htmlFor="file-input">Select video file</label>
            <input
              type="file"
              name="file-input"
              id="file-input"
              accept="video/*"
            />
          </div>
          <div className="file" onClick={inputContainerOnClick}>
            <div className="icon">
              <CiImageOn />
            </div>
            <label htmlFor="cover-image">Select cover image</label>
            <input
              type="file"
              accept="image/*"
              name="cover-image"
              id="cover-image"
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
