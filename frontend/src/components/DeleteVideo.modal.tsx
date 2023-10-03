import { useState } from "react";
import { useVideo } from "../hooks";
import { createPortal } from "react-dom";
import { styled } from "styled-components";
import { lighten, darken } from "polished";
import ModalContainer from "./modal.styled";
import { AiOutlineClose } from "react-icons/ai";

type ModalProps = {
  videoId: string;
  onClose: () => void;
};

const StyledBackground = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  backdrop-filter: blur(1px);
`;

const StyledModal = styled(ModalContainer)`
  width: 360px;

  div {
    padding: 0 1rem 1rem;
  }

  p {
    margin: unset;
    padding: 1rem;
  }
`;

export default function DeleteVideoModal({ onClose, videoId }: ModalProps) {
  const container = document.querySelector("#modal-portal");
  if (!container) {
    return null;
  }

  const videoTitle = useVideo(videoId)?.title;
  const [processing, setProcessing] = useState(false);

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
          <span>Are you sure ?</span>
          <button onClick={onClose}>
            <AiOutlineClose />
          </button>
        </h1>
        <div>
          <p>You are about to delete this video :</p>
        </div>
      </StyledModal>
    </>,
    container
  );
}
