const state = {
    refresh: false
};

const mutations = {
    REFRESH: (state) => {
        state.refresh = !state.refresh;
    }
};

const actions = {
    Refresh({ commit }) {
        commit('REFRESH');
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};