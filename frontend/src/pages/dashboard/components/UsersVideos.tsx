import { MdVideoLibrary } from "react-icons/md";
import { PiVideo } from "react-icons/pi";
import { styled } from "styled-components";
import { VideoCard, UploadVideoModal } from "../../../components";
import StyledVideolist from "./video-list.styled";
import { darken, lighten, transparentize } from "polished";
import { useState } from "react";
import { useVideos } from "../../../hooks";

const StyledNewVideoButton = styled.button`
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  outline: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  width: 100%;
  height: 100%;
  min-height: 360px;
  border: 2px dashed
    ${({ theme }) => transparentize(0.65, theme.colors.primary)};
  border-radius: 10px;
  transition: background 500ms;

  span {
    font-weight: bold;
    font-size: 1.25rem;
  }

  .plus {
    font-size: 1.5rem;
  }

  &:hover {
    background: ${({ theme }) =>
      theme.theme === "light"
        ? darken(0.05, theme.colors.background)
        : lighten(0.05, theme.colors.background)};
  }
`;

const NewVideoButton = (props: { toggleModal: () => void }) => {
  return (
    <StyledNewVideoButton onClick={props.toggleModal}>
      <span className="plus">
        <PiVideo />
      </span>
      <span>Upload video</span>
    </StyledNewVideoButton>
  );
};

export default function UsersVideos() {
  const { videos, fetchVideos } = useVideos("/video");
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {showModal && (
        <UploadVideoModal
          onClose={() => {
            setShowModal(false);
            fetchVideos();
          }}
        />
      )}
      <h1>
        <span>Your videos</span>
        <MdVideoLibrary />
      </h1>
      <StyledVideolist>
        {videos.map((video, i) => (
          <li key={i}>
            <VideoCard {...video} hideUserData />
          </li>
        ))}
        <li>
          <NewVideoButton toggleModal={() => setShowModal(true)} />
        </li>
      </StyledVideolist>
    </div>
  );
}