import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

type Video = {
  id: string;
  title: string;
  coverImage: string;
  uploadDate: Date;
  userId: string;
  length?: string;
};

export function useVideos(endpoint: string) {
  const [videos, setVideos] = useState<Video[]>([]);
  const navigate = useNavigate();

  const fetchData = () => {
    const fetch = async (token: string) => {
      const res = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data) {
        setVideos(
          res.data.map((video: any) => {
            if (video.length) {
              const duration = video.length as number;
              if (duration >= 60) {
                const min = Math.round(duration / 60);
                if (min >= 60) {
                  const hour = Math.round(min / 60);
                  video.length = `${hour} h`;
                } else {
                  video.length = `${min} min`;
                }
              } else {
                video.length = `${duration} sec`;
              }
            }

            return {
              ...video,
              uploadDate: new Date(video.uploadDate),
            };
          })
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { videos, fetchData };
}
