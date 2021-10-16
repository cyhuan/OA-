import { getToken, setToken, removeToken, setTimeStamp } from "@/utils/auth";
import { login, getUserInfo, getUserDetailById } from "@/api/user";
import { resetRouter } from '@/router'
const state = {
  token: getToken(),// 设置token为共享状态 初始化vuex的时候 就先从缓存中读取
  userInfo: {}
};
const mutations = {
  setToken(state, token) {
    state.token = token; // 将数据设置给vuex
    // 同步给缓存
    setToken(token);
  },
  removeToken(state) {
    state.token = null; // 将vuex的数据置空
    removeToken(); // 同步到缓存
  },
  setUserInfo(state, result) {
    state.userInfo = result;
  },
  removeUseInfo(state) {
    state.userInfo = {}
  }
};
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data); // 拿到token
    context.commit("setToken", result); // 设置token
    setTimeStamp()  //设置时间戳
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result
  },

  logout(context) {
    context.commit('removeToken')
    context.commit('removeUseInfo')
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
