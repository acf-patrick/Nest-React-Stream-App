import { MdVideoLibrary } from "react-icons/md";
import { PiVideo } from "react-icons/pi";
import { styled } from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import VideoCard from "./VideoCard";
import StyledVideolist from "./video-list.styled";
import { darken, lighten, transparentize } from "polished";

type Video = {
  id: string;
  title: string;
  coverImage: string;
  uploadDate: Date;
  userId: string;
};

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

function NewVideoButton() {
  return (
    <StyledNewVideoButton>
      <span className="plus">
        <PiVideo />
      </span>
      <span>Upload video</span>
    </StyledNewVideoButton>
  );
}

export default function UsersVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async (token: string) => {
      const res = await api.get("/video", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data) {
        setVideos(
          res.data.map((video: Video) => ({
            ...video,
            uploadDate: new Date(video.uploadDate),
          }))
        );
      }
    };

    const handleFetch = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await fetch(token);
        } else {
          throw new Error();
        }
      } catch {
        const refresh = localStorage.getItem("refresh");
        if (refresh) {
          localStorage.removeItem("refresh");
          const res = await api.get("/auth/refresh-tokens", {
            headers: {
              Authorization: `Bearer ${refresh}`,
            },
          });

          const { accessToken, refreshToken } = res.data;
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refresh", refreshToken);
          await fetch(accessToken);
        }
      }
    };

    handleFetch().catch((err) => {
      console.error(err);
      navigate("/login");
    });
  }, []);

  return (
    <StyledVideolist>
      <h1>
        <span>Your videos</span>
        <MdVideoLibrary />
      </h1>
      <ul>
        {videos.map((video, i) => (
          <li key={i}>
            <VideoCard {...video}  />
          </li>
        ))}
        <li>
          <NewVideoButton />
        </li>
      </ul>
    </StyledVideolist>
  );
}
