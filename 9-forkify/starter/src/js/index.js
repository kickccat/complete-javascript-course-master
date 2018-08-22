import axios from 'axios';
// API Key: a3edb4bbf6b6ef169d9d361ca3530bb8
// API URL: http://food2fork.com/api/search

async function getResults(query) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = 'a3edb4bbf6b6ef169d9d361ca3530bb8';
    try {
        const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${query}`);
        const recipes = res.data.recipes;
        console.log(recipes);
    } catch (e) {
        alert(e);
    }
}

getResults('tomato pasta}}');