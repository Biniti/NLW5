import { createContext, ReactNode } from "react";
import {useState} from "react"

type Episode ={
    title: string,
    members: string,
    thumbnail: string
    duration: number,
    url: string,
}

type PlayerContextData = {
    episodeList: Episode[],
    currentEpisodeIndex: number,
    isPlaying: boolean,
    playList: (list: Episode[], index: number) => void;
    play: (episode: Episode) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
    toggleLoop: () => void;
    isLooping: boolean;
    isShuffling: boolean;
    toggleShuffle: () => void;
    clearPlayerState: () => void;
}


type PlayerContextProviderProps = {
    children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }


function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
}


  function togglePlay(){
    setIsPlaying(!isPlaying);
  }


  function toggleLoop(){
    setIsLooping(!isLooping);
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }

  const hasPrevious = currentEpisodeIndex > 0 ;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function playNext(){
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }

  }

  function playPrevious(){
    if(hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider value = {
        { 
        episodeList, 
        currentEpisodeIndex, 
        play, 
        isPlaying, 
        playList,
        playNext,
        playPrevious,
        togglePlay, 
        setPlayingState,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        toggleShuffle,
        isShuffling,
        clearPlayerState
        }
    }>

        { children } 
    </PlayerContext.Provider>
  )
}