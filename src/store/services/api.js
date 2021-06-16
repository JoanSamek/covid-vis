import axios from 'axios'

export default axios.create({
    baseURL: 'https://corona.lmao.ninja/v2/continents',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
})