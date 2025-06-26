import React, { useRef, useEffect } from 'react';

const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      
      // Force play
      setTimeout(() => {
        video.play().catch(console.log);
      }, 100);
    }
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -2,
      overflow: 'hidden'
    }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translate(-50%, -50%) scale(1.1)',
          objectFit: 'cover',
          filter: 'blur(2px) brightness(0.7)',
        }}
      >
        <source src="https://cdn.pixabay.com/video/2022/05/10/116634-708909760_large.mp4" type="video/mp4" />
        <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
        <source src="https://player.vimeo.com/external/415498549.sd.mp4?s=abc123" type="video/mp4" />
      </video>
      
      {/* White overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8))',
        zIndex: -1
      }} />
    </div>
  );
};

export default VideoBackground;