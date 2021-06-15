import testService from '../services/testService'

const state = {
    test: []
}

const getters = {
    test: state => { return state.test }
}

const actions ={
    getTest({ commit }, params){
        testService.fetchTest(params)
        .then(test => { commit('setTest', test) })
    }
}

const mutations = {
    setTest(state, test){
        state.test = test
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}