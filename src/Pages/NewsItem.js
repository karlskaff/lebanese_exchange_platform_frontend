import axios from 'axios'
import { React, useState, useEffect } from "react";
import './newsItem.css'

// This code was written with the help of a youtube video
 //A refernce to the video: https://youtu.be/AfifHeANwe0
 //In this file we are dealing with each news item alone
 
const NewsItem = ({ title, description, url, urlToImage}) => {
    return(
        <div className='news-app'>
            <div className='news-item'>
                <img className='news-img' src={urlToImage} alt={urlToImage}/>
                <h3 className='news-item-title'><a href={url}>{title}</a></h3>
                <p className='news-item-descriptio'>{description}</p>

            </div>

        </div>
    )

}

export default NewsItem

