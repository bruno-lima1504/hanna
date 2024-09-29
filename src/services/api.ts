import axios from 'axios';

const api  = axios.create({ 
    baseURL: 'https://hanna.jaia.cloud/api/'
})

export { api };