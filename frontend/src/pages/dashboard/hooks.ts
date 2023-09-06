import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { AxiosError } from "axios";

type Video = {
  id: string;
  title: string;
  coverImage: string;
  uploadDate: Date;
  userId: string;
  length?: string;
};

export function useVideo(id: string) {
  const [video, setVideo] = useState<Video | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get(`/video?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        data.uploadDate = new Date(data.uploadDate);
        setVideo(data);
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.response?.status === 401) {
            try {
              const refresh = localStorage.getItem("refresh");
              const res = await api.get(`/auth/refresh-tokens`, {
                headers: {
                  Authorization: `Bearer ${refresh}`,
                },
              });

              const { refreshToken, accessToken } = res.data;
              localStorage.setItem("refresh", refreshToken);
              localStorage.setItem("token", accessToken);

              const { data } = await api.get(`/video?id=${id}`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });
              data.uploadDate = new Date(data.uploadDate);
              setVideo(data);
            } catch (e) {
              console.error(e);
              localStorage.clear();
              navigate("/login");
            }
          }
        }
      }
    };

    fetchVideo();
  }, [id]);

  return video;
}

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
    if (endpoint) {
      fetchData();
    }
  }, [endpoint]);

  return { videos, fetchData };
}
