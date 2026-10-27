import { useEffect,useState } from "react";


export const useAudio = (url) => {
    const [audio, setAudio] = useState(url);
  
    useEffect(() => {
      if (audio) {
        audio.play();
      }
  
      return () => audio && audio.pause();
    }, [audio]);
  
    return [setAudio];
  };
  