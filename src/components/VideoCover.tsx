"use client";

import { useRef, useState } from "react";

type Props = {
  videoUrl?: string;
  posterUrl?: string;
};

export default function VideoCover({ videoUrl, posterUrl }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  if (!videoUrl) {
    return (
      <div className="h-72 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
        Aucune vidéo
      </div>
    );
  }

  return (
    <div className="relative h-72 rounded-xl overflow-hidden border shadow-sm">

      {/* COVER IMAGE */}
      {!playing && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterUrl || "/placeholder.jpg"}
            alt="Vidéo du bien"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* PLAY OVERLAY */}
          <button
            onClick={() => {
              setPlaying(true);
              setTimeout(() => videoRef.current?.play(), 100);
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl shadow">
              ▶
            </div>
          </button>
        </>
      )}

      {/* VIDEO */}
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className={`w-full h-full object-cover ${
          playing ? "block" : "hidden"
        }`}
      />
    </div>
  );
}
