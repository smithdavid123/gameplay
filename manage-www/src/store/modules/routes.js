import lottery from '@/router/modules/lottery';
import business from '@/router/modules/business';
import finance from '@/router/modules/finance';
import states from '@/router/modules/state';
import league from '@/router/modules/league';
import manage from '@/router/modules/manage';

const state = {
    routes: [...lottery, ...business, ...finance, ...states, ...league, ...manage],
    tags: []
};

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.routes = routes;
    },
    SET_TAGS: (state, tags) => {
        state.tags = tags;
    }
};

const actions = {
    generateRoutes({ commit }) {
        return new Promise(resolve => {
            let accessedRoutes = [];
            commit('SET_ROUTES', accessedRoutes);
            resolve(accessedRoutes);
        });
    },
    generateTags({ commit }, valus) {
        commit('SET_TAGS', valus);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};