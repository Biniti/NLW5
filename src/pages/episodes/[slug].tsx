import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { GetStaticPaths, GetStaticProps } from "next";
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from "./episode.module.scss"
import Image from "next/image"
import Link from "next/link"
import { usePlayer } from "../../components/Player";
import Head from "next/head"

type Episode = {
    id: string,
    title: string,
    thumbnail: string,
    description: string,
    members: string,
    publishedAt: String,
    duration: number,
    durationAsString: string,
    url: string,
    
}

type EpisodeProps = {
    episode: Episode,
}

export default function Episode( { episode }: EpisodeProps){
    const { play } = usePlayer();

    return(
        <div className = {styles.episode}>
            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>
            <div className = {styles.thumbnailContainer}>
               <Link href = "/">
                <button type="button">
                    <img src="/images/arrow-left.svg" alt="Voltar"/>
                </button>
                </Link> 
                <Image 
                width = {700}
                height = {160}
                src= {episode.thumbnail}
                objectFit = "cover"
                />

                <button 
                type = "button"
                onClick = { 
                    () => play(episode)
                    }>
                    <img 
                    src="/images/play.svg" 
                    alt="Tocar episodio"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>


            <div className = {styles.description} 
            dangerouslySetInnerHTML = {{__html: episode.description }}
            />
                

        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () =>
{
    const { data } = await api.get("episodes", {
        params: {
        _limit: 2,
        _sort: "published_at",
        _order: "desc"
        }
    })
    
    const paths = data.map(episode =>{
        return{
            params: {
                slug: episode.id,
            } 
        }
    })

    return{
    paths,
    fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async (ctx) =>{
    const { slug } = ctx.params;
    //slug é o nome do arquivo

    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
            
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), "d MMM yy", {locale: ptBR}),
        duration: Number(data.file.duration),
        durationAsString:convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,      
    };

    return{
        props: {
            episode
        },
        revalidate: 60 * 60 * 24 // recarrega a pagina a cada 24 horas
    }
}