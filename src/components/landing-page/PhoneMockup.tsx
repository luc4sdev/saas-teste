"use client";

import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

export function PhoneMockup() {
    const [isClient, setIsClient] = useState(false);
    const playerRef = useRef<ReactPlayer>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return (
            <div className="relative flex items-center justify-center w-[300px] h-[600px] bg-black rounded-[40px] border-[10px] border-gray-900 shadow-2xl overflow-hidden">
                <div className="w-full h-full bg-gray-800 rounded-[30px]" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center w-[300px] h-[600px] bg-black rounded-[40px] border-[10px] border-gray-900 shadow-2xl overflow-hidden">
            <div className="w-full h-full">
                <ReactPlayer
                    ref={playerRef}
                    url="/gfitapp-dashboard.mp4"
                    width="100%"
                    height="100%"
                    playing={true}
                    loop={true}
                    muted={true}
                    playsinline={true}
                    controls={false}
                />
            </div>
        </div>
    );
}