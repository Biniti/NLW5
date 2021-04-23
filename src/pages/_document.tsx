//Chamado uma úncia vez independete de quantas chamadas foram feitas

import Document, {Html, Head, Main, NextScript} from "next/document";

export default class MyDocument extends Document{
    render(){
        return(
            <Html>
                <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet"/>
                
                <link rel="shortcut icon" href = "./images/favicon.png"type = "image/png"/>
                </Head>

                <body>
                    <Main/>
                    <NextScript/>
                </body>
            </Html>
        );
    }
}