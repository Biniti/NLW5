
import { PlayerContext } from "../../contexts/PlayerContext";
import styles from "./styles.module.scss";
import { useContext, useRef, useEffect, useState } from "react";
import Image from "next/image"
import Slider from 'rc-slider';

import "rc-slider/assets/index.css";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export default function Player(){
    const audioRef = useRef<HTMLAudioElement>(null)

    const [progress, setProgress] = useState(0);

    const { episodeList, 
            currentEpisodeIndex, 
            isPlaying, 
            togglePlay,
            setPlayingState,
            playNext,
            playPrevious,
            toggleLoop,
            isLooping,
            hasNext,
            hasPrevious,
            toggleShuffle,
            isShuffling,
            clearPlayerState,
        } = usePlayer();
    
    useEffect( () => { 
        if(!audioRef.current){
            return;
        }

        if(isPlaying){
            audioRef.current.play();
        }else{
            audioRef.current.pause();
        }
    },
    [isPlaying])

    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener("timeupdate", event =>{
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
        }else{
            clearPlayerState()
        }
    }

    const episode = episodeList[currentEpisodeIndex];

    return(
           
            <div className = {styles.playerContainer}>

                <header>
                    <img src="./images/playing.svg" alt="Tocando agora"/>
                    <strong>Tocando Agora</strong>
                </header>

                { episode ? (
                             <div className = {styles.currentEpisode}>
                                   <Image 
                                          width = {590} 
                                          height = {590}
                                          src = {episode.thumbnail} 
                                          objectFit = "cover"
                                          
                                   />
                                   <strong>{episode.title}</strong>
                                   <span>{episode.members}</span>
                             </div>
                            )
                            :
                            (<div className={styles.emptyPlayer}>
                        <strong>Selecione um podcast para ouvir</strong>
                        </div>)
                        }
                
                <footer className = {!episode ? styles.empty : ""}>
                    <div className = {styles.progress}>
                        <span>{convertDurationToTimeString(progress)}</span>
                        <div className = {styles.slider}>
                            {episode ? 
                            (<Slider
                                max = {episode.duration}
                                value = {progress}
                                onChange = {handleSeek}
                                trackStyle = {{backgroundColor:'#04361'}}
                                railStyle = {{ backgroundColor:'#9F75FF'}}
                                handleStyle = {{ borderColor:'#04361', borderWidth: 4}}
                            />):
                            (
                                <div className = {styles.emptySlider}></div>
                            )}
                        </div>
                        <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                    </div>

                    {episode && (
                        <audio
                            src = {episode.url}
                            ref = {audioRef}
                            autoPlay
                            onEnded = {handleEpisodeEnded}
                            loop = { isLooping }
                            onPlay = { () => setPlayingState(true) }
                            onPause = { () => setPlayingState(false) }
                            onLoadedMetadata = {setupProgressListener}
                        />
                         
                    )}            
                                
                    <div className = {styles.buttons}>
                        <button 
                        type = "button" 
                        disabled = {!episode || episodeList.length === 1}
                        onClick = { toggleShuffle }
                        className = {isShuffling ? styles.isActive : ""}>
                                <img src="./images/shuffle.svg" alt="Embaralhar"/>
                        </button>
                        <button 
                        type = "button"  
                        disabled = {!episode || !hasPrevious}
                        onClick = {playPrevious}>
                                <img src="./images/play-previous.svg" alt="Tocar anterior"/>
                        </button>
                        <button type = "button" 
                                className = {styles.playButton}  
                                disabled = {!episode}
                                onClick = {togglePlay}
                                >
                                {isPlaying
                                    ? <img src="./images/pause.svg" alt="Pusar"/>
                                        :
                                      <img src="./images/play.svg" alt="Tocar"/>
                                }
                        </button>
                        <button 
                        type = "button"  
                        onClick = {playNext} 
                        disabled = {!episode || !hasNext}>
                                <img src="./images/play-next.svg" alt="Tocar Proxima"/>
                        </button>
                        <button 
                        type = "button"  
                        disabled = {!episode}
                        onClick = {toggleLoop}
                        className = {isLooping ? styles.isActive : ""}>
                                <img src="./images/repeat.svg" alt="Repetir"/>
                        </button>
                    </div>
                </footer>
            </div>
    )
}


export const usePlayer = () => {
    return useContext(PlayerContext);
}