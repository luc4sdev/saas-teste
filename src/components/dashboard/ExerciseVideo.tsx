"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface ExerciseVideoProps {
    videoUrl: string;
}

export function ExerciseVideo({ videoUrl }: ExerciseVideoProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoContainerRef = useRef<HTMLDivElement>(null);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    const handleEnterFullscreen = (e: React.MouseEvent) => {
        if (isIOS) return;

        e.preventDefault();
        e.stopPropagation();
        if (videoContainerRef.current) {
            videoContainerRef.current
                .requestFullscreen()
                .then(() => {
                    setIsFullscreen(true);
                    setIsPlaying(true);
                })
        }
    };

    const handleExitFullscreen = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (document.fullscreenElement) {
            document
                .exitFullscreen()
                .then(() => {
                    setIsFullscreen(false);
                    setIsPlaying(false);
                })
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            const fullscreenElement = document.fullscreenElement;
            setIsFullscreen(!!fullscreenElement);
            if (!fullscreenElement) setIsPlaying(false);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isFullscreen && !isIOS) {
                handleExitFullscreen();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isFullscreen]);

    return (
        <div
            ref={videoContainerRef}
            className="relative w-11/12 max-w-[400px] aspect-[9/16] rounded-xl overflow-hidden shadow-md border border-zinc-600"
        >
            <ReactPlayer
                width="100%"
                height="100%"
                controls
                playing={isPlaying}
                loop
                volume={0}
                url={videoUrl}
                config={{
                    youtube: {
                        playerVars: {
                            color: "white",
                        },
                    },
                }}
            />
            {!isFullscreen && !isIOS && (
                <div
                    onClick={handleEnterFullscreen}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors z-10"
                />
            )}
            {isFullscreen && !isIOS && (
                <button
                    onClick={handleExitFullscreen}
                    className="absolute top-2 right-2 p-1 bg-black/70 rounded-full text-white hover:bg-black/90 z-20"
                    aria-label="Sair da tela cheia"
                >
                    <X className="size-6" />
                </button>
            )}
        </div>
    );
}