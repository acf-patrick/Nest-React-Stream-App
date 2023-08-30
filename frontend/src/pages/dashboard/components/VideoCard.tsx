import { useEffect, useState } from "react";
import { styled } from "styled-components";
import api from "../../../api";
import { darken, lighten } from "polished";
import { AiFillPlayCircle } from "react-icons/ai";

type CardProps = {
  id: string;
  title: string;
  coverImage: string;
  uploadDate: Date;
  userId: string;
  hideUserData?: boolean;
};

const StyledCard = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;
  transition: box-shadow 500ms;

  &:hover {
    box-shadow: 0 1px 15px
      ${({ theme }) =>
        theme.theme === "light"
          ? darken(0.5, theme.colors.background)
          : lighten(0.5, theme.colors.background)};

    .play {
      transform: translate(0);
      opacity: 1;
    }
  }

  #title {
    letter-spacing: normal;
    font-weight: bold;
    font-size: 1rem;
  }

  & > div:first-of-type {
    border-bottom: 2px solid ${({ theme }) => theme.colors.quaternary};
    background-color: grey;
    position: relative;

    img {
      max-height: 280px;
      object-fit: cover;
    }
  }

  & > div:last-of-type {
    padding: 0.5rem 1rem 2rem;
    background: ${({ theme }) =>
      theme.theme === "light"
        ? darken(0.1, theme.colors.background)
        : lighten(0.1, theme.colors.background)};
  }

  img {
    width: 100%;
    object-fit: contain;
  }

  .play {
    position: absolute;
    left: 1rem;
    bottom: 0;
    font-size: 4rem;
    color: ${({ theme }) => theme.colors.playButton};
    opacity: 0;
    transform: translateY(10px);
    transition: transform 500ms, opacity 500ms;
  }

  .upload-date {
    margin-top: 1rem;
    color: ${({ theme }) =>
      theme.theme === "light"
        ? lighten(0.125, theme.colors.primary)
        : darken(0.125, theme.colors.primary)};
  }

  .user-name {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: ${({ theme }) =>
      theme.theme === "light"
        ? lighten(0.05, theme.colors.primary)
        : darken(0.05, theme.colors.primary)};

    .dot {
      display: block;
      width: 7px;
      height: 7px;
      background: ${({ theme }) => theme.colors.quaternary};
      border-radius: 100%;
    }
  }

  .user-picture {
    position: relative;

    div {
      position: absolute;
      bottom: 0;
      right: 1rem;
      transform: translateY(50%);
      width: 52px;
      height: 52px;
      border-radius: 50rem;
      padding: 2px;
      border: 2px solid ${({ theme }) => theme.colors.quaternary};
      background-color: ${({ theme }) => theme.colors.background};

      img {
        border-radius: 100%;
      }
    }
  }
`;

export default function VideoCard(props: CardProps) {
  const [user, setUser] = useState<{
    name: string;
    picture: string;
  } | null>(null);

  const [uploadDate, setUploadDate] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await api.get(`/user/${props.userId}`);
      const name: string = res.data.fullname;
      setUser({
        name:
          name.length >= 20
            ? name
                .split(" ")
                .map((name, i) => (i > 0 ? `${name[0].toUpperCase()}.` : name))
                .join(" ")
            : name,
        picture: res.data.avatar,
      });
    };

    const timestamp = +props.uploadDate;
    const elapsed = Date.now() - timestamp;

    const min = elapsed / 1000 / 60;
    if (min <= 1) {
      setUploadDate("now");
    } else {
      const hours = min / 60;
      if (hours < 1) {
        const elapsed = Math.floor(hours);
        setUploadDate(`${elapsed} minute${elapsed > 1 ? "s" : ""} ago`);
      } else {
        if (hours < 24) {
          const elapsed = Math.floor(hours);
          setUploadDate(`${elapsed} hour${elapsed > 1 ? "s" : ""} ago`);
        } else {
          const days = Math.floor(hours / 24);
          setUploadDate(`${days} day${days > 1 ? "s" : ""} ago`);
        }
      }
    }

    if (!props.hideUserData) {
      fetchUserData().catch((err) => console.error(err));
    }
  }, []);

  return (
    <StyledCard>
      <div>
        <img src={`http://localhost:3000/videos/${props.coverImage}`} alt="" />
        <span className="play">
          <AiFillPlayCircle />
        </span>
      </div>
      {user && (
        <div className="user-picture">
          <div>
            <img src={user.picture} alt="user" />
          </div>
        </div>
      )}
      <div>
        {user && (
          <div className="user-name">
            <span>{user.name}</span>
            <span className="dot"></span>
          </div>
        )}
        <h1 id="title">{props.title}</h1>
        {uploadDate && <div className="upload-date">{uploadDate}</div>}
      </div>
    </StyledCard>
  );
}
