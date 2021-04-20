//Formas de usar uma api

//SPA

//SSR

//SSG

import { useEffect } from "react";


export default function Home(props) {
 
 /* useEffect(() => {
    fetch("http://localhost:3333/episodes")
    .then(response => response.json())
    .then(data => console.log(data))
  },[])*/ //MODELO SPA 
  //quando algo mudar na aplicação algo acontece 

  console.log(props.episodes);

  return (
      
      <h1>index</h1>
      
  )
}

//Usando o Static site generator(SSG) Só funciona em produção
//para isso podemos usar o yarn start(porque roda como se estivesse em produção)
export async function getStaticProps(){
  const response = await fetch("http://localhost:3333/episodes")
  const data = await response.json()  
  
  return { 
    props: {//props obrigatório
      episodes: data,
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