import axios from 'axios'
import Typography from "@material-ui/core/Typography";
import { React, useState, useEffect } from "react";
import NewsItem from './NewsItem';
import './newsItem.css'

// This section was written with the help of a youtube video
// A reference to the video: https://youtu.be/AfifHeANwe0
//In this file we are using the news Items from the NewsItem.js file in order to display them on the News Page.

const NewsList = () =>{
    const[articles,setArticles] = useState([])
    useEffect(()=> {
        const getArticles = async () =>{
            const response = await axios.get('https://newsapi.org/v2/everything?q=Lebanese%20economy&apiKey=7d50d0139a854d69a29600929e52e60b')
            console.log(response)
            setArticles(response.data.articles)

        }
        getArticles()
    },[])
    return (

        <div className='news-list-container'>
            <Typography variant="h2" gutterBottom>
              News
            </Typography>
            {articles.map(article => {
                return (
                    <div className='news-item'>
                    <NewsItem
                        title={article.title}
                        description={article.description}
                        url={article.url}
                        urlToImage={article.urlToImage}
                    />
                    </div>
                )
            })}
        </div>
    )
}

export default NewsList;