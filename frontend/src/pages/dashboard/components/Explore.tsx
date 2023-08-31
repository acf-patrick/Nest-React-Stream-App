import { IoTelescopeSharp } from "react-icons/io5";
import StyledVideolist from "./video-list.styled";
import { useVideos } from "../hooks";
import VideoCard from "./VideoCard";

export default function Explore() {
  const videos = useVideos("/video/a");

  return (
    <div>
      <h1>
        <span>Discover</span>
        <IoTelescopeSharp />
      </h1>
      <StyledVideolist>
        {videos.map((video, i) => (
          <li key={i}>
            <VideoCard {...video} />
          </li>
        ))}
      </StyledVideolist>
    </div>
  );
}
