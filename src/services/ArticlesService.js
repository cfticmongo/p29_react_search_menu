import axios from 'axios';

export const getAllArticles = async () => {
    try {
        const response = await axios.get('http://localhost:3000/articles');
        return response.data.articles
    } catch(err) {
        if(err) {
            console.log(err)
        }
    }
}

export async function searchArticles(brands, gender, tags) {
    try {
        if(brands.length === 0) {
            brands = 'todos';
        } else {
            brands = JSON.stringify(brands);
        }
        if(tags.length === 0) {
            tags = 'todos';
        } else {
            tags = JSON.stringify(tags);
        }

        const endPointFilter = 'http://localhost:3000/articles/filter/' + brands + '/' + gender + '/' + tags;
        const response = await axios.get(endPointFilter);
        return response.data.articles || [];
    } catch(err) {
        console.log(err);
    }
}