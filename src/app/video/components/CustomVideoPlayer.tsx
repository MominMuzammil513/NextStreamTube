"use client";
import React, { useRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Settings, Subtitles, RotateCcw, Minimize, SkipForward, SkipBack, ChevronRight
} from "lucide-react";
import {
  togglePlayPause, toggleMute, setVolume, setProgress, setDuration, toggleAutoplay, toggleSubtitles,
  toggleSettingsOpen, toggleStableVolume, toggleAmbientMode, toggleAnnotations, setPlaybackSpeed,
  setQuality, toggleMiniPlayer, toggleTheaterMode, toggleFullScreen
} from '@/lib/store/features/videoPlayerSlice';

interface VideoPlayerProps {
  videoFile: string;
  thumbnail: string;
  title: string;
  views: number;
}

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle }) => (
  <div
    onClick={onToggle}
    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${isOn ? 'bg-blue-500' : 'bg-gray-300'}`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isOn ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </div>
);

interface MenuItemProps {
  label: string;
  onClick: () => void;
  rightElement?: React.ReactNode;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, onClick, rightElement }) => (
  <div
    className="flex justify-between items-center py-2 px-4 hover:bg-gray-700 cursor-pointer"
    onClick={onClick}
  >
    <span>{label}</span>
    {rightElement}
  </div>
);

interface SubMenuProps {
  title: string;
  children: React.ReactNode;
  onBack: () => void;
}

const SubMenu: React.FC<SubMenuProps> = ({ title, children, onBack }) => (
  <div>
    <div className="flex items-center py-2 px-4 bg-gray-800">
      <button onClick={onBack} className="mr-2">
        <ChevronRight className="w-4 h-4 transform rotate-180" />
      </button>
      <span>{title}</span>
    </div>
    {children}
  </div>
);

const SettingsMenu: React.FC<{ isSettingsOpen: boolean; onClose: () => void; videoState: any; dispatch: any; }> = ({ isSettingsOpen, onClose, videoState, dispatch }) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const mainMenu = (
    <>
      <MenuItem
        label="Playback speed"
        onClick={() => setActiveSubmenu('playbackSpeed')}
        rightElement={<span>{videoState.playbackSpeed}x</span>}
      />
      <MenuItem
        label="Quality"
        onClick={() => setActiveSubmenu('quality')}
        rightElement={<span>{videoState.quality}</span>}
      />
      <MenuItem
        label="Stable Volume"
        onClick={() => dispatch(toggleStableVolume())}
        rightElement={
          <ToggleSwitch
            isOn={videoState.isStableVolumeOn}
            onToggle={() => dispatch(toggleStableVolume())}
          />
        }
      />
      <MenuItem
        label="Ambient Mode"
        onClick={() => dispatch(toggleAmbientMode())}
        rightElement={
          <ToggleSwitch
            isOn={videoState.isAmbientModeOn}
            onToggle={() => dispatch(toggleAmbientMode())}
          />
        }
      />
      <MenuItem
        label="Annotations"
        onClick={() => dispatch(toggleAnnotations())}
        rightElement={
          <ToggleSwitch
            isOn={videoState.isAnnotationsOn}
            onToggle={() => dispatch(toggleAnnotations())}
          />
        }
      />
    </>
  );

  const playbackSpeedMenu = (
    <SubMenu title="Playback speed" onBack={() => setActiveSubmenu(null)}>
      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
        <MenuItem
          key={speed}
          label={`${speed}x`}
          onClick={() => {
            dispatch(setPlaybackSpeed(speed));
            setActiveSubmenu(null);
          }}
          rightElement={speed === videoState.playbackSpeed && <span>✓</span>}
        />
      ))}
    </SubMenu>
  );

  const qualityMenu = (
    <SubMenu title="Quality" onBack={() => setActiveSubmenu(null)}>
      {['auto', '144p', '240p', '360p', '480p', '720p', '1080p'].map((q) => (
        <MenuItem
          key={q}
          label={q}
          onClick={() => {
            dispatch(setQuality(q));
            setActiveSubmenu(null);
          }}
          rightElement={q === videoState.quality && <span>✓</span>}
        />
      ))}
    </SubMenu>
  );

  return (
    isSettingsOpen && (
      <div className="absolute bottom-16 right-4 bg-gray-900 rounded-lg text-white shadow-lg w-60 overflow-hidden">
        {activeSubmenu === null && mainMenu}
        {activeSubmenu === 'playbackSpeed' && playbackSpeedMenu}
        {activeSubmenu === 'quality' && qualityMenu}
      </div>
    )
  );
};

const CustomVideoPlayer: React.FC<VideoPlayerProps> = ({ videoFile, thumbnail, title, views }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const dispatch = useAppDispatch();
  const videoState = useAppSelector((state) => state.videoPlayer);
  const { isPlaying, isMuted, volume, progress, duration, isAutoplayOn, isSubtitlesOn, isSettingsOpen, isStableVolumeOn, isAmbientModeOn, isAnnotationsOn, playbackSpeed, quality, isMiniPlayer, isTheaterMode, isFullScreen } = videoState;

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = isMuted;
      videoElement.volume = volume;
      videoElement.playbackRate = playbackSpeed;
    }
  }, [isMuted, volume, playbackSpeed]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.onloadedmetadata = () => dispatch(setDuration(videoElement.duration));
      videoElement.ontimeupdate = () => {
        const progressPercent = (videoElement.currentTime / videoElement.duration) * 100;
        dispatch(setProgress(progressPercent));
      };
      videoElement.onended = () => {
        dispatch(togglePlayPause());
        if (isAutoplayOn) {
          console.log("Autoplaying next video...");
        }
      };
    }
    return () => {
      if (videoElement) {
        videoElement.onloadedmetadata = null;
        videoElement.ontimeupdate = null;
        videoElement.onended = null;
      }
    };
  }, [isAutoplayOn, dispatch]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isPlaying) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }
  }, [isPlaying]);

  const togglePlayPauseHandler = () => dispatch(togglePlayPause());
  const toggleMuteHandler = () => dispatch(toggleMute());
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setVolume(Number(e.target.value)));
  };

  const fullScreenButton = () => {
    const videoContainer = videoRef.current?.parentElement;
    if (videoContainer) {
      if (!isFullScreen) {
        if (videoContainer.requestFullscreen) {
          videoContainer.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      dispatch(toggleFullScreen());
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  return (
    <div
      className={`relative w-full ${isTheaterMode ? 'h-[70vh]' : 'h-0 pb-[56.25%]'} bg-black mt-10 rounded-xl overflow-hidden ${isMiniPlayer ? 'fixed bottom-4 right-4 w-64 h-36' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={videoFile}
        poster={thumbnail}
        onClick={togglePlayPauseHandler}
      />

      {/* Overlay for hover effect */}
      <div onClick={togglePlayPauseHandler} className={`absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 ${isHovering ? 'bg-opacity-30' : ''}`} />
      <div
        onClick={togglePlayPauseHandler}
        className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-opacity duration-300 ${isHovering ? 'block' : 'hidden'}`}
      >
        {isPlaying ? (
          <Pause className="w-12 h-12 text-white z-50" />
        ) : (
          <Play className="w-12 h-12 text-white z-50" />
        )}
      </div>
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pt-10 pb-2 px-4 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full mb-2">
          <input type="range" min="0" max="100" value={progress} onChange={(e) => {
            const newProgress = Number(e.target.value);
            dispatch(setProgress(newProgress));
            if (videoRef.current) {
              videoRef.current.currentTime = (newProgress / 100) * videoRef.current.duration;
            }
          }}
            className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #ff0000 0%, #ff0000 ${progress}%, #4d4d4d ${progress}%, #4d4d4d 100%)`,
            }}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Play/Pause button */}
            <button onClick={togglePlayPauseHandler} className="text-white hover:text-red-500 transition-colors">
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            {/* Skip buttons */}
            <button onClick={skipBackward} className="text-white hover:text-red-500 transition-colors">
              <SkipBack className="w-5 h-5" />
            </button>
            <button onClick={skipForward} className="text-white hover:text-red-500 transition-colors">
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center group">
              <button onClick={toggleMuteHandler} className="text-white group-hover:text-red-500 transition-colors">
                {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="w-0 group-hover:w-24 transition-all duration-300 h-1 ml-2 bg-white rounded-full appearance-none cursor-pointer opacity-0 group-hover:opacity-100"
              />
            </div>

            {/* Time Display */}
            <span className="text-white text-sm">
              {videoRef.current ? formatTime(videoRef.current.currentTime) : "0:00"} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Autoplay toggle */}
            <button onClick={() => toggleAutoplay()} className={`text-white hover:text-red-500 transition-colors ${isAutoplayOn ? 'text-red-500' : ''}`}>
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Subtitles toggle */}
            <button onClick={() => dispatch(toggleSubtitles())} className={`text-white hover:text-red-500 transition-colors ${isSubtitlesOn ? 'text-red-500' : ''}`}>
              <Subtitles className="w-5 h-5" />
            </button>

            {/* Settings */}
            <button onClick={() => dispatch(toggleSettingsOpen())} className="text-white hover:text-red-500 transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* Mini Player */}
            <button onClick={() => dispatch(toggleMiniPlayer())} className="text-white hover:text-red-500 transition-colors">
              <Minimize className="w-5 h-5" />
            </button>

            {/* Theater Mode */}
            <button onClick={() => dispatch(toggleTheaterMode())} className="text-white hover:text-red-500 transition-colors">
              {isTheaterMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            {/* Fullscreen Button */}
            <button onClick={fullScreenButton} className="text-white hover:text-red-500 transition-colors">
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <SettingsMenu
        isSettingsOpen={videoState.isSettingsOpen}
        onClose={() => dispatch(toggleSettingsOpen())}
        videoState={videoState}
        dispatch={dispatch}
      />
    </div>
  );
};

export default CustomVideoPlayer;




// "use client";
// import React, { useRef, useState, useEffect } from "react";
// import {
//   Play,
//   Pause,
//   Volume2,
//   VolumeX,
//   Maximize2,
//   Minimize2,
//   Settings,
//   Subtitles,
//   RotateCcw,
//   Minimize,
//   SkipForward,
//   SkipBack,
//   ChevronRight,
// } from "lucide-react";

// interface VideoPlayerProps {
//   videoFile: string;
//   thumbnail: string;
//   title: string;
//   views: number;
// }

// interface ToggleSwitchProps {
//   isOn: boolean;
//   onToggle: () => void;
// }

// const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle }) => (
//   <div
//     onClick={onToggle}
//     className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer ${isOn ? 'bg-blue-500' : 'bg-gray-300'
//       }`}
//   >
//     <div
//       className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isOn ? 'translate-x-5' : 'translate-x-0'
//         }`}
//     />
//   </div>
// );

// interface MenuItemProps {
//   label: string;
//   onClick: () => void;
//   rightElement?: React.ReactNode;
// }

// const MenuItem: React.FC<MenuItemProps> = ({ label, onClick, rightElement }) => (
//   <div
//     className="flex justify-between items-center py-2 px-4 hover:bg-gray-700 cursor-pointer"
//     onClick={onClick}
//   >
//     <span>{label}</span>
//     {rightElement}
//   </div>
// );

// interface SubMenuProps {
//   title: string;
//   children: React.ReactNode;
//   onBack: () => void;
// }

// const SubMenu: React.FC<SubMenuProps> = ({ title, children, onBack }) => (
//   <div>
//     <div className="flex items-center py-2 px-4 bg-gray-800">
//       <button onClick={onBack} className="mr-2">
//         <ChevronRight className="w-4 h-4 transform rotate-180" />
//       </button>
//       <span>{title}</span>
//     </div>
//     {children}
//   </div>
// );

// interface SettingsMenuProps {
//   isSettingsOpen: boolean;
//   setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   isStableVolumeOn: boolean;
//   setIsStableVolumeOn: React.Dispatch<React.SetStateAction<boolean>>;
//   isAmbientModeOn: boolean;
//   setIsAmbientModeOn: React.Dispatch<React.SetStateAction<boolean>>;
//   isAnnotationsOn: boolean;
//   setIsAnnotationsOn: React.Dispatch<React.SetStateAction<boolean>>;
//   playbackSpeed: number;
//   setPlaybackSpeed: React.Dispatch<React.SetStateAction<number>>;
//   quality: string;
//   setQuality: React.Dispatch<React.SetStateAction<string>>;
// }

// const SettingsMenu: React.FC<SettingsMenuProps> = ({
//   isSettingsOpen,
//   setIsSettingsOpen,
//   isStableVolumeOn,
//   setIsStableVolumeOn,
//   isAmbientModeOn,
//   setIsAmbientModeOn,
//   isAnnotationsOn,
//   setIsAnnotationsOn,
//   playbackSpeed,
//   setPlaybackSpeed,
//   quality,
//   setQuality
// }) => {
//   const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
//   // const handlePlaybackSpeedClick = (speed: number) => {
//   //   setPlaybackSpeed(speed);
//   //   setActiveSubmenu(null);
//   // };

//   // const handleQualityClick = (q: string) => {
//   //   setQuality(q);
//   //   setActiveSubmenu(null);
//   // };

//   const handleStableVolumeToggle = () => {
//     setIsStableVolumeOn(!isStableVolumeOn);
//   };

//   const handleAmbientModeToggle = () => {
//     setIsAmbientModeOn(!isAmbientModeOn);
//   };

//   const handleAnnotationsToggle = () => {
//     setIsAnnotationsOn(!isAnnotationsOn);
//   };
//   const mainMenu = (
//     <>
//       <MenuItem
//         label="Playback speed"
//         onClick={() => setActiveSubmenu('playbackSpeed')}
//         rightElement={<span>{playbackSpeed}x</span>}
//       />
//       <MenuItem
//         label="Quality"
//         onClick={() => setActiveSubmenu('quality')}
//         rightElement={<span>{quality}</span>}
//       />
//       <MenuItem
//         label="Stable Volume"
//         onClick={handleStableVolumeToggle}
//         rightElement={
//           <ToggleSwitch
//             isOn={isStableVolumeOn}
//             onToggle={handleStableVolumeToggle}
//           />
//         }
//       />
//       <MenuItem
//         label="Ambient Mode"
//         onClick={handleAmbientModeToggle}
//         rightElement={
//           <ToggleSwitch
//             isOn={isAmbientModeOn}
//             onToggle={handleAmbientModeToggle}
//           />
//         }
//       />
//       <MenuItem
//         label="Annotations"
//         onClick={handleAnnotationsToggle}
//         rightElement={
//           <ToggleSwitch
//             isOn={isAnnotationsOn}
//             onToggle={handleAnnotationsToggle}
//           />
//         }
//       />
//     </>
//   );

//   const playbackSpeedMenu = (
//     <SubMenu title="Playback speed" onBack={() => setActiveSubmenu(null)}>
//       {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
//         <MenuItem
//           key={speed}
//           label={`${speed}x`}
//           onClick={() => {
//             setPlaybackSpeed(speed);
//             setActiveSubmenu(null);
//           }}
//           rightElement={speed === playbackSpeed && <span>✓</span>}
//         />
//       ))}
//     </SubMenu>
//   );

//   const qualityMenu = (
//     <SubMenu title="Quality" onBack={() => setActiveSubmenu(null)}>
//       {['auto', '144p', '240p', '360p', '480p', '720p', '1080p'].map((q) => (
//         <MenuItem
//           key={q}
//           label={q}
//           onClick={() => {
//             setQuality(q);
//             setActiveSubmenu(null);
//           }}
//           rightElement={q === quality && <span>✓</span>}
//         />
//       ))}
//     </SubMenu>
//   );

//   return (
//     isSettingsOpen && (
//       <div className="absolute bottom-16 right-4 bg-gray-900 rounded-lg text-white shadow-lg w-60 overflow-hidden">
//         {activeSubmenu === null && mainMenu}
//         {activeSubmenu === 'playbackSpeed' && playbackSpeedMenu}
//         {activeSubmenu === 'quality' && qualityMenu}
//       </div>
//     )
//   );
// };

// const CustomVideoPlayer: React.FC<VideoPlayerProps> = ({
//   videoFile,
//   thumbnail,
//   title,
//   views,
// }) => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [volume, setVolume] = useState(1);
//   const [progress, setProgress] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isAutoplayOn, setIsAutoplayOn] = useState(true);
//   const [isSubtitlesOn, setIsSubtitlesOn] = useState(false);
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [isStableVolumeOn, setIsStableVolumeOn] = useState(false);
//   const [isAmbientModeOn, setIsAmbientModeOn] = useState(false);
//   const [isAnnotationsOn, setIsAnnotationsOn] = useState(true);
//   const [playbackSpeed, setPlaybackSpeed] = useState(1);
//   const [quality, setQuality] = useState("auto");
//   const [isMiniPlayer, setIsMiniPlayer] = useState(false);
//   const [isTheaterMode, setIsTheaterMode] = useState(false);
//   const [isHovering, setIsHovering] = useState(false);

//   useEffect(() => {
//     const videoElement = videoRef.current;

//     if (videoElement) {
//       videoElement.onloadedmetadata = () => {
//         setDuration(videoElement.duration);
//       };

//       videoElement.ontimeupdate = () => {
//         const progressPercent =
//           (videoElement.currentTime / videoElement.duration) * 100;
//         setProgress(progressPercent);
//       };

//       videoElement.onended = () => {
//         setIsPlaying(false);
//         if (isAutoplayOn) {
//           console.log("Autoplaying next video...");
//         }
//       };
//     }
//   }, [isAutoplayOn]);

//   const togglePlayPause = () => {
//     const videoElement = videoRef.current;
//     if (videoElement) {
//       if (isPlaying) {
//         videoElement.pause();
//       } else {
//         videoElement.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted;
//       setIsMuted(!isMuted);
//     }
//   };

//   const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newVolume = Number(e.target.value);
//     setVolume(newVolume);
//     if (videoRef.current) {
//       videoRef.current.volume = newVolume;
//       setIsMuted(newVolume === 0);
//     }
//   };

//   const toggleFullscreen = () => {
//     const videoContainer = videoRef.current?.parentElement;
//     if (videoContainer) {
//       if (!isFullscreen) {
//         if (videoContainer.requestFullscreen) {
//           videoContainer.requestFullscreen();
//         }
//       } else {
//         if (document.exitFullscreen) {
//           document.exitFullscreen();
//         }
//       }
//       setIsFullscreen(!isFullscreen);
//     }
//   };

//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60).toString().padStart(2, "0");
//     return `${minutes}:${seconds}`;
//   };

//   const skipForward = () => {
//     if (videoRef.current) {
//       videoRef.current.currentTime += 10;
//     }
//   };

//   const skipBackward = () => {
//     if (videoRef.current) {
//       videoRef.current.currentTime -= 10;
//     }
//   };
//   const handleHover = (isHovering: boolean) => {
//     setIsHovering(isHovering); // Updated hover state handler
//   };

//   return (
//     <div
//       className={`relative w-full ${isTheaterMode ? 'h-[70vh]' : 'h-0 pb-[56.25%]'} bg-black mt-10 rounded-xl overflow-hidden ${isMiniPlayer ? 'fixed bottom-4 right-4 w-64 h-36' : ''}`}
//       onMouseEnter={() => setIsHovering(true)}
//       onMouseLeave={() => setIsHovering(false)}
//     >
//       <video
//         ref={videoRef}
//         src={videoFile}
//         className="absolute top-0 left-0 w-full h-full object-fill"
//         poster={thumbnail}
//         onClick={togglePlayPause}
//       />

//       {/* Overlay for hover effect */}
//       <div onClick={togglePlayPause} className={`absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 ${isHovering ? 'bg-opacity-30' : ''}`} />
//       <div
//         onClick={togglePlayPause}
//         className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-opacity duration-300 ${isHovering ? 'block' : 'hidden'}`}
//       >
//         {isPlaying ? (
//           <Pause className="w-12 h-12 text-white z-50" />
//         ) : (
//           <Play className="w-12 h-12 text-white z-50" />
//         )}
//       </div>
//       {/* Controls */}
//       <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent pt-10 pb-2 px-4 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
//         {/* Progress Bar */}
//         <div className="w-full mb-2">
//           <input
//             type="range"
//             min="0"
//             max="100"
//             value={progress}
//             onChange={(e) => {
//               const input = e.target as HTMLInputElement;
//               if (videoRef.current) {
//                 const newTime =
//                   (Number(input.value) / 100) * videoRef.current.duration;
//                 videoRef.current.currentTime = newTime;
//               }
//             }}
//             className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
//             style={{
//               background: `linear-gradient(to right, #ff0000 0%, #ff0000 ${progress}%, #4d4d4d ${progress}%, #4d4d4d 100%)`,
//             }}
//           />
//         </div>

//         <div className="flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             {/* Play/Pause button */}
//             <button onClick={togglePlayPause} className="text-white hover:text-red-500 transition-colors">
//               {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
//             </button>

//             {/* Skip buttons */}
//             <button onClick={skipBackward} className="text-white hover:text-red-500 transition-colors">
//               <SkipBack className="w-5 h-5" />
//             </button>
//             <button onClick={skipForward} className="text-white hover:text-red-500 transition-colors">
//               <SkipForward className="w-5 h-5" />
//             </button>

//             {/* Volume Control */}
//             <div className="flex items-center group">
//               <button onClick={toggleMute} className="text-white group-hover:text-red-500 transition-colors">
//                 {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
//               </button>
//               <input
//                 type="range"
//                 min="0"
//                 max="1"
//                 step="0.1"
//                 value={volume}
//                 onChange={handleVolumeChange}
//                 className="w-0 group-hover:w-24 transition-all duration-300 h-1 ml-2 bg-white rounded-full appearance-none cursor-pointer opacity-0 group-hover:opacity-100"
//               />
//             </div>

//             {/* Time Display */}
//             <span className="text-white text-sm">
//               {videoRef.current ? formatTime(videoRef.current.currentTime) : "0:00"} / {formatTime(duration)}
//             </span>
//           </div>

//           <div className="flex items-center space-x-4">
//             {/* Autoplay toggle */}
//             <button onClick={() => setIsAutoplayOn(!isAutoplayOn)} className={`text-white hover:text-red-500 transition-colors ${isAutoplayOn ? 'text-red-500' : ''}`}>
//               <RotateCcw className="w-5 h-5" />
//             </button>

//             {/* Subtitles toggle */}
//             <button onClick={() => setIsSubtitlesOn(!isSubtitlesOn)} className={`text-white hover:text-red-500 transition-colors ${isSubtitlesOn ? 'text-red-500' : ''}`}>
//               <Subtitles className="w-5 h-5" />
//             </button>

//             {/* Settings */}
//             <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="text-white hover:text-red-500 transition-colors">
//               <Settings className="w-5 h-5" />
//             </button>

//             {/* Mini Player */}
//             <button onClick={() => setIsMiniPlayer(!isMiniPlayer)} className="text-white hover:text-red-500 transition-colors">
//               <Minimize className="w-5 h-5" />
//             </button>

//             {/* Theater Mode */}
//             <button onClick={() => setIsTheaterMode(!isTheaterMode)} className="text-white hover:text-red-500 transition-colors">
//               {isTheaterMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
//             </button>

//             {/* Fullscreen Button */}
//             <button onClick={toggleFullscreen} className="text-white hover:text-red-500 transition-colors">
//               {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       <SettingsMenu
//         isSettingsOpen={isSettingsOpen}
//         setIsSettingsOpen={setIsSettingsOpen}
//         isStableVolumeOn={isStableVolumeOn}
//         setIsStableVolumeOn={setIsStableVolumeOn}
//         isAmbientModeOn={isAmbientModeOn}
//         setIsAmbientModeOn={setIsAmbientModeOn}
//         isAnnotationsOn={isAnnotationsOn}
//         setIsAnnotationsOn={setIsAnnotationsOn}
//         playbackSpeed={playbackSpeed}
//         setPlaybackSpeed={setPlaybackSpeed}
//         quality={quality}
//         setQuality={setQuality}
//       />
//     </div>
//   );
// };

// export default CustomVideoPlayer;