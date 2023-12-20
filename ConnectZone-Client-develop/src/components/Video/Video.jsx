import React from 'react'
import ReactPlayer from 'react-player'
import { twMerge } from 'tailwind-merge'
const Video = ({ url, controls, pip = true, height = '100%', width = '100%', ...props }) => {
    return (
        <>
            <ReactPlayer
                url={url}
                controls={controls}
                muted={true}
                height={height}
                width={width}
                pip={pip}

                {...props}
            />
        </>
    )
}

export default Video;