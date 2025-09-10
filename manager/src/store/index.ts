import { createStore } from 'vuex'

export default createStore({
  state: {
    userRole: 1, // 默认权限等级
    isAuthenticated: false,
    username: ''
  },
  getters: {
    isAdmin: (state) => state.userRole === -1,
    userRole: (state) => state.userRole,
    isAuthenticated: (state) => state.isAuthenticated,
    username: (state) => state.username
  },
  mutations: {
    SET_USER_ROLE(state, role) {
      state.userRole = role
    },
    SET_AUTHENTICATED(state, status) {
      state.isAuthenticated = status
    },
    SET_USERNAME(state, username) {
      state.username = username
    },
    LOGOUT(state) {
      state.userRole = 1
      state.isAuthenticated = false
      state.username = ''
    }
  },
  actions: {
    updateUserRole({ commit }, role) {
      commit('SET_USER_ROLE', role)
      localStorage.setItem('userRole', role.toString())
    },
    login({ commit }, { username, role }) {
      commit('SET_USERNAME', username)
      commit('SET_USER_ROLE', role)
      commit('SET_AUTHENTICATED', true)
      localStorage.setItem('userRole', role.toString())
      localStorage.setItem('username', username)
    },
    logout({ commit }) {
      commit('LOGOUT')
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('admin_token')
      localStorage.removeItem('userRole')
    }
  },
  modules: {
  }
})
