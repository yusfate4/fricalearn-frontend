
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

/**
 * Mux Video Player Component
 * Plays HLS (.m3u8) videos from Oak National Academy
 * 
 * Props:
 * - videoUrl: Mux stream URL (e.g., "https://stream.mux.com/ABC123.m3u8")
 * - poster: Optional thumbnail image
 * - onEnded: Callback when video finishes
 */
export default function MuxVideoPlayer({ videoUrl, poster, onEnded }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;

    const video = videoRef.current;

    // Check if browser supports HLS natively (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
    } 
    // Use hls.js for other browsers
    else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
      });
      
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ Video ready to play');
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error('❌ HLS Error:', data);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Network error, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else {
      console.error('❌ HLS not supported in this browser');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoUrl]);

  return (
    <div className="mux-video-container">
      <video
        ref={videoRef}
        controls
        poster={poster}
        onEnded={onEnded}
        style={{
          width: '100%',
          maxHeight: '500px',
          backgroundColor: '#000',
          borderRadius: '8px',
        }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
