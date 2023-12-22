import { darken, lighten } from "polished";
import { useState } from "react";
import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import { VscLoading } from "react-icons/vsc";
import { keyframes, styled } from "styled-components";
import { useVideo } from "../hooks";
import ModalContainer from "./modal.styled";

type ModalProps = {
  videoId: string;
  onClose: () => void;
};

const spin = keyframes`
from {
  transform: rotate(0);
} to {
  transform: rotate(360deg);
}
`;

const StyledBackground = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  backdrop-filter: blur(1px);
`;

const StyledModal = styled(ModalContainer)`
  width: 380px;

  & > div {
    padding: 0 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border-bottom: 1px solid
      ${({ theme }) =>
        theme.theme === "light"
          ? darken(0.2, theme.colors.background)
          : lighten(0.2, theme.colors.background)};

    & > div:first-of-type {
      color: ${({ theme }) => theme.colors.quaternary};
      font-size: 3.5rem;
    }
  }

  .buttons {
    padding: 1rem;
    justify-content: flex-end;

    button {
      all: unset;
      cursor: pointer;
      width: 6rem;
      text-align: center;
      padding: 2px 0;
      border-radius: 3px;
      outline: 2px solid ${({ theme }) => theme.colors.quaternary};
      transition: color 250ms, backkground-color 250ms;
    }

    svg {
      animation: ${spin} 750ms ease-out infinite;
    }

    .cancel {
      &:hover {
        background-color: ${({ theme }) => theme.colors.quaternary};
        color: white;
      }

      &[disabled] {
        background: grey;
        outline: none;

        &:hover {
          background: grey;
          color: unset;
        }
      }
    }

    .yes {
      background-color: ${({ theme }) => theme.colors.quaternary};
      color: white;

      &[disabled] {
        background-color: ${({ theme }) => theme.colors.quaternary};

        &:hover {
          background-color: ${({ theme }) => theme.colors.quaternary};
        }
      }

      &:hover {
        background-color: transparent;
        color: unset;
      }
    }
  }
`;

export default function EditVideoModal({ onClose, videoId }: ModalProps) {
  const container = document.querySelector("#modal-portal");
  if (!container) {
    return null;
  }

  const [processing, setProcessing] = useState(false);
  const video_ = useVideo(videoId);

  const proceed = () => {
    setProcessing(true);
  };

  return createPortal(
    <>
      <StyledBackground
        onClick={() => {
          if (!processing) {
            onClose();
          }
        }}
      />
      <StyledModal>
        <h1>
          <span>Edit video metadatas</span>
          <button onClick={onClose}>
            <AiOutlineClose />
          </button>
        </h1>
        <div>C'est le test ça hein</div>
        <div className="buttons">
          <button onClick={onClose} className="cancel" disabled={processing}>
            Cancel
          </button>
          <button onClick={proceed} className="yes" disabled={processing}>
            {processing ? <VscLoading /> : "Yes"}
          </button>
        </div>
      </StyledModal>
    </>,
    container
  );
}
