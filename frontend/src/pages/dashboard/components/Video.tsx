import { useParams } from "react-router-dom";
import { PiVideo } from "react-icons/pi";
import { useVideo, useVideos } from "../../../hooks";
import { useMemo, useEffect, useState, useRef } from "react";
import { styled } from "styled-components";
import { darken, lighten, transparentize } from "polished";
import { VideoListItem } from "../../../components";
import api from "../../../api";

const StyledNotFound = styled.div`
  margin-top: 10rem;
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

const StyledVideoContainer = styled.div`
  margin-top: 2rem;
  padding-right: 2rem;
  display: flex;
  gap: 2rem;

  & > div:first-of-type {
    flex-grow: 1;
  }

  h1 {
    letter-spacing: normal !important;
    font-weight: bold !important;
    margin: 1rem 0 0;
  }

  video {
    width: 100%;
    border-radius: 10px;
    max-height: ${({ theme }) => theme.sizes.video.maxHeight};
    box-shadow: 0 3px 10px
      ${({ theme }) =>
        theme.theme === "light"
          ? darken(0.5, theme.colors.background)
          : lighten(0.25, theme.colors.background)};
  }

  .player {
    display: grid;
    place-items: center;
    min-height: 360px;
  }

  .upload-date {
    font-size: 0.75rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => transparentize(0.25, theme.colors.primary)};
  }

  .more {
    width: 360px;
    max-height: calc(100vh - 180px);
    overflow-y: auto;

    &:hover {
      &::-webkit-scrollbar-thumb {
        background: ${({ theme }) =>
          theme.theme === "light"
            ? darken(0.5, theme.colors.background)
            : lighten(0.5, theme.colors.background)};
      }
    }

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: transparent;
      transition: background 300ms;
    }

    ul {
      padding: unset;
      margin: unset;
      list-style: none;
    }

    li {
      padding: unset;
      margin-bottom: 0.75rem;
    }
  }

  .user {
    display: flex;
    align-items: center;
    gap: 1rem;

    .name {
      font-size: 1.5rem;
    }
  }
`;

const StyledUserPicture = styled.div<{ $src: string }>`
  width: 64px;
  height: 64px;
  border-radius: 5rem;
  overflow: hidden;
  padding: 2px;
  outline: 2px solid ${({ theme }) => theme.colors.quaternary};

  div {
    width: 100%;
    height: 100%;
    background-image: ${({ $src }) => `url(${$src})`};
    background-color: white;
    background-size: cover;
    border-radius: 5rem;
  }
`;

function transformDate(date: Date) {
  const timestamp = +date;
  const elapsed = Date.now() - timestamp;

  const min = elapsed / 1000 / 60;
  if (min <= 1) {
    return "now";
  } else {
    const hours = min / 60;
    if (hours < 1) {
      const elapsed = Math.round(hours);
      return elapsed === 0
        ? "Just now"
        : `${elapsed} minute${elapsed > 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      const elapsed = Math.round(hours);
      return `${elapsed} hour${elapsed > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.round(hours / 24);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  }
}

export default function Video() {
  const { id } = useParams();
  const video = useVideo(id!);
  const moreVideos = useVideos(
    video ? `/video/a?user=${video.userId}` : ""
  ).videos;
  const [user, setUser] = useState<{
    name: string;
    avatar: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const uploadDate = useMemo(() => {
    if (!video) {
      return "";
    }
    return transformDate(video.uploadDate);
  }, [video]);

  useEffect(() => {
    if (!video) {
      return;
    }

    const videoTag = videoRef.current;
    if (videoTag) {
      videoTag.load();
    }

    // set tab title
    document.title = video.title;

    // fetch user's datas
    api
      .get(`/user/${video.userId}`)
      .then((res) => {
        const { fullname, avatar } = res.data;
        setUser({
          name: fullname,
          avatar: avatar
            ? `${import.meta.env.VITE_API_ENDPOINT}/user/picture/${avatar}`
            : "",
        });
      })
      .catch((err) => console.error(err));

    return () => {
      document.title = "Streamly";
    };
  }, [video, id]);

  if (!video) {
    return (
      <StyledNotFound>
        <span>Video not found</span>
        <PiVideo />
      </StyledNotFound>
    );
  }

  return (
    <StyledVideoContainer>
      <div>
        <div className="player">
          <video controls autoPlay ref={videoRef}>
            <source
              src={`${import.meta.env.VITE_API_ENDPOINT}/video/${video.id}`}
            />
          </video>
        </div>
        <h1>
          {video.title.length > 64
            ? video.title.slice(0, 64) + "..."
            : video.title}
        </h1>
        <div className="upload-date">{uploadDate}</div>
        {user && (
          <div className="user">
            <StyledUserPicture
              $src={user.avatar ? user.avatar : "/images/profile-pic.png"}
            >
              <div></div>
            </StyledUserPicture>
            <div className="name">{user.name}</div>
          </div>
        )}
      </div>
      {moreVideos && moreVideos.length > 1 && (
        <div>
          <div className="more">
            <ul>
              {moreVideos.map((video, i) => {
                return video.id !== id ? (
                  <li key={i}>
                    <VideoListItem
                      id={video.id}
                      cover={`${
                        import.meta.env.VITE_API_ENDPOINT
                      }/video/cover/${video.coverImage}`}
                      title={video.title}
                      uploader={user ? user.name : ""}
                      uploadDate={transformDate(video.uploadDate)}
                    />
                  </li>
                ) : null;
              })}
            </ul>
          </div>
          <p>
            {moreVideos.length - 1} other video
            {moreVideos.length > 2 ? "s" : ""} found ✨
          </p>
        </div>
      )}
    </StyledVideoContainer>
  );
}
