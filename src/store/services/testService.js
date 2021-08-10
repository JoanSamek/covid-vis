import api from './api'

export default {
    fetchTest(params) {
        return api.get('', params)
            .then(response => response.data)
    }
}