import api from './api'

export default {
    fetchTest(params) {
        return api.get('v1/states/current.json', params)
            .then(response => response)
    }
}