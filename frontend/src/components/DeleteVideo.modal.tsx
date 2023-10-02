import { useState } from "react";
import { createPortal } from "react-dom";
import { styled } from "styled-components";
import { lighten, darken } from "polished";
import { useVideo } from "../hooks";

type ModalProps = {
  videoId: string;
  onClose: () => void;
};

const StyledBackground = styled.div``;

const StyledModal = styled.div`
  background: ${({ theme }) =>
    theme.theme === "light"
      ? theme.colors.background
      : lighten(0.1, theme.colors.background)};
  box-shadow: 0 5px 15px
    ${({ theme }) =>
      theme.theme === "light"
        ? darken(0.25, theme.colors.background)
        : lighten(0.25, theme.colors.background)};
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
      <StyledModal></StyledModal>
    </>,
    container
  );
}
