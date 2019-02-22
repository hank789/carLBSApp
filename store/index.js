import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user: "",
		baseApiUrl: "",
		token: "",
		geoWatchId: "",
		lastPositionUploadTime: 0
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
		setToken(state, token) {
			state.token = token;
		},
        logout(state) {
            state.user = "";
			state.token = "";
        },
		setBaseApiUrl(state, url) {
			state.baseApiUrl = url
		},
		setGeoWatchId(state, geoWatchId) {
			state.geoWatchId = geoWatchId
		},
		setLastPositionUploadTime(state, datetime) {
			state.lastPositionUploadTime = datetime
		}
    }
})

export default store
