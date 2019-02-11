import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        hasLogin: false,
        user: "",
		baseApiUrl: "",
		token: ""
    },
    mutations: {
        login(state, user) {
            state.user = user;
            state.hasLogin = true;
        },
		setToken(state, token) {
			state.token = token;
		},
        logout(state) {
            state.user = "";
            state.hasLogin = false;
			state.token = "";
        },
		setBaseApiUrl(state, url) {
			state.baseApiUrl = url
		}
    }
})

export default store
