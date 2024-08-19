"use client";
import { useState, useEffect } from "react";
import "./index.scss";
import Image from "next/image";

interface IProps {
  url: string;
  title: string;
}

const VideoCard: React.FC<IProps> = ({ url, title }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // Extract video ID from YouTube URL and generate thumbnail URL
  useEffect(() => {
    const videoId = extractYouTubeId(url);
    if (videoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`);
    }
  }, [url]);

  const handlePlay = () => setIsPlaying(true);

  return (
    <div className="video-card shadow">
      {!isPlaying ? (
        <div className="video-placeholder" onClick={handlePlay}>
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={`Thumbnail for ${title}`}
              height={200}
              width={200}
              className="video-thumbnail"
            />
          ) : (
            <div className="no-thumbnail-placeholder">
              {/* Fallback UI when no thumbnail is available */}
              <div className="play-button-overlay">
                <button className="play-button">▶</button>
              </div>
            </div>
          )}
          <div className="play-button-overlay">
            <button className="play-button">▶</button>
          </div>
        </div>
      ) : (
        <iframe
          height="200"
          src={`${url}?autoplay=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        ></iframe>
      )}
      <div className="p-4">
        <h3
          className="video-title font-bold font-gotham text-[15px] black-text mt-4"
          onClick={handlePlay}
        >
          {title}
        </h3>
      </div>
    </div>
  );
};

export default VideoCard;

// Helper function to extract YouTube video ID
const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|watch\?vi=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};
