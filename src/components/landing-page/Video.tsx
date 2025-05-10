'use client'

import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export function Video() {
    return (
        <div className="bg-background border border-white rounded-xl aspect-video flex items-center justify-center mt-20 p-[4px] overflow-hidden">
            <ReactPlayer
                style={{ borderRadius: '10px', overflow: 'hidden' }}
                light={'workout-banner.svg'}
                width="100%"
                height="100%"
                controls
                volume={1}
                url='https://www.youtube.com/watch?v=J2L7gNup3QE&ab_channel=GFIT'
            />
        </div>
    )
}