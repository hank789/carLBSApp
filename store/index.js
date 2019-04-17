import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        user: "",
		baseApiUrl: "",
		token: "",
		geoWatchId: "",
		geoWatchId2: "",
		lastPositionUploadTime: 0,
		isAppHide: false,
		choosePosition: ''
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
		setGeoWatchId2(state, geoWatchId) {
			state.geoWatchId2 = geoWatchId
		},
		setLastPositionUploadTime(state, datetime) {
			state.lastPositionUploadTime = datetime
		},
		setAppHide(state, hide) {
			state.isAppHide = hide
		},
		setChoosePosition(state, position) {
			state.choosePosition = position
		}
    }
})

export default store
