//Formas de usar uma api

//SPA

//SSR

//SSG

//import { useEffect } from "react";


import { GetStaticProps } from 'next';
import Image from "next/image";
import Link from "next/link"
import { api } from '../services/api';
import ptBR from "date-fns/locale/pt-BR"
import { format, parseISO } from "date-fns"
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from "./home.module.scss"
import { usePlayer } from '../components/Player';
import Head from "next/head"

type Episode ={
  id: string,
  title: string,
  thumbnail: string,
  members: string,
  publishedAt: String,
  duration: number,
  durationAsString: string,
  url: string,
}

type HomeProps = {
    allEpisodes: Episode[],
    latestEpisodes: Episode[],
  }

export default function Home( {latestEpisodes, allEpisodes}: HomeProps) {
 
 /* useEffect(() => {
    fetch("http://localhost:3333/episodes")
    .then(response => response.json())
    .then(data => console.log(data))
  },[])*/ //MODELO SPA 
  //quando algo mudar na aplicação algo acontece 

  const { playList } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
      <div className = {styles.homepage}>
        <Head>
          <title>Home Podcastr</title>
        </Head>
        <section className = {styles.latestEpisodes}>
          <h2>
            Últimos lançamentos
          </h2>

          <ul>
            {latestEpisodes.map((episode, index) => {
                return(
                  <li key={episode.id}>

                  <div style = {{ width: 100}}>
                    <Image
                    
                    width = {192}
                    height = {192}
                    src = {episode.thumbnail} 
                    alt = {episode.title}  
                    objectFit = "cover"
                    />
                  </div>
                  
                  <div className = {styles.episodeDetails}>

                   <Link href= {`/episodes/${episode.id}`}> 
                    <a>{episode.title}</a>
                    </Link>
                    <p>{episode.members}</p>
                    <span> {episode.publishedAt} </span>
                    <span> {episode.durationAsString }</span>
                  </div>

                  <button type = "button" 
                          onClick = { 
                            () => playList ( episodeList, index )
                            }>
                    <img src="/images/play-green.svg" alt="Tocar episodio" />
                  </button>
                  </li>
                )
            })}
          </ul>
        </section>
        
        <section className = {styles.allEpisodes}>
            <h2>Todos episodios</h2>

            <table cellSpacing = {0}>
                <thead>
                  <tr>
                  <th></th>
                  <th>Podcast</th>
                  <th>Integrantes</th>
                  <th>Data</th>
                  <th>Duração</th>
                  <th></th>
                  </tr>
                </thead>

                <tbody>
                  {allEpisodes.map((episode, index) => {
                    return(
                      <tr key = {episode.id}>
                          <td style = {{ width: 100}}>
                            <Image
                              width = {120}
                              height = {120}
                              src = {episode.thumbnail}
                              alt = {episode.title}
                              objectFit = "cover"
                            />
                          </td>

                          <td>
                            <Link href = {`/episodes/${episode.id}`}>
                            <a>{episode.title}</a>
                            </Link>
                          </td>
                          
                          <td>{episode.members}</td>
                          <td style = {{ width: 100}}>{episode.publishedAt}</td>
                          <td>{episode.durationAsString}</td>
                          <td>
                            <button type="button" onClick = {
                              () => playList(episodeList, index + latestEpisodes.length)
                            }>
                              <img src = "/images/play-green.svg" alt = "Tocar episódio"/>
                            </button>
                          </td>
                      </tr>
                    )
                  })}
                </tbody>
            </table>
        </section>

      </div>
  )
}

//Usando o Static site generator(SSG) Só funciona em produção
//para isso podemos usar o yarn start(porque roda como se estivesse em produção)
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc"
    }
  })
  
  const episodes = data.map(episode =>{
    
    return { 
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString:convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,

    };
  })


const latestEpisodes = episodes.slice(0, 2);

const allEpisodes = episodes.slice(2, episodes.length);

  return { 
    props: {//props obrigatório
      allEpisodes,
      latestEpisodes,
    },
    revalidate: 60 * 60 * 8,//a cada 8 horas os dados se atualizam
  }
}

//Usando  o Server side randering(SSR)
/*export async function getServerSideProps(){
  const response = await fetch("http://localhost:3333/episodes")
  const data = await response.json()  
  
  return { 
    props: {//props obrigatório
      episodes: data,
    }
  }
}*/
//tudo retornando do prpos é repassado para o componente de onde a função esta sendo chamada