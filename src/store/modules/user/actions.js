import { appRouter, constantRoutes } from '@/router/router.js'
import { resetRouter } from '@/router'
import Util from '@/utils'
import * as authApi from '@/api/auth.js'
import * as userApi from '@/api/users.js'
import i18n from '@/locale'

function hasPermission(permissons, route) {
  if (route.meta && route.meta.permission) {
    return permissons.some(item => {
      if (typeof route.meta.permission === 'string') {
        return route.meta.permission === item
      } else {
        return route.meta.permission.includes(item)
      }
    })
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param permissons
 */
export function filterAsyncRoutes(routes, permissons) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permissons, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissons)
        if (tmp.children.length > 0) {
          if (tmp.menuGroup && tmp.children.length > 3) {
            let newMenuGroup = tmp.menuGroup.filter(item => {
              return tmp.children.find(ele => item.routes.includes(ele.name))
            })
            tmp.menuGroup = newMenuGroup
          } else {
            tmp.menuGroup = null
          }
          res.push(tmp)
        }
      } else {
        res.push(tmp)
      }
    }
  })

  return res
}

export default {
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      authApi
        .login({ username: username.trim(), password: password })
        .then(response => {
          commit('setToken', response.token)
          commit('setUserDetail', username.trim())
          if (response.perm && response.perm.module) {
            let Route = response.perm.module
            let permissons = []
            for (let rou in Route) {
              if (!Util.isEmpty(Route[rou])) {
                let actions = Route[rou].split(',')
                actions.forEach(action => permissons.push(`${rou}.${action}`))
              }
            }
            if (response.perm.user_id === 3) {
              permissons = permissons.concat('admin.users', 'admin.roles')
            }
            // permissons must be a non-empty array
            if (!permissons || permissons.length <= 0) {
              reject(i18n.t('common.noPermisson'))
            }
            commit('setPermission', permissons)
          } else {
            // reject(i18n.t('common.noPermisson'))
            // commit('setPermission', [123])
          }
          Util.setToken(response.token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      authApi
        .logout()
        .then(() => {
          commit('setToken', '')
          commit('setPermission', null)
          commit('setAccessRoutes', null)
          commit('setUserDetail', null)
          Util.removeToken()
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.permission && state.permission.length > 0) {
        commit('setPermission', state.permission)
        resolve(state.permission)
      } else {
        userApi
          .perm()
          .then(data => {
            let Route = data.module
            let permissons = []
            for (let rou in Route) {
              if (!Util.isEmpty(Route[rou])) {
                let actions = Route[rou].split(',')
                actions.forEach(action => permissons.push(`${rou}.${action}`))
              }
            }
            if (data.user_id === 3) {
              permissons = permissons.concat('admin.users', 'admin.roles')
            }
            console.log(permissons)
            // permissons must be a non-empty array
            if (!permissons || permissons.length <= 0) {
              reject(i18n.t('common.noPermisson'))
            }
            commit('setPermission', permissons)
            commit('setRoute', Route)
            resolve(permissons)
          })
          .catch(error => {
            reject(error)
          })
      }
    })
  },
  generateRoutes({ commit }, permisson) {
    return new Promise(resolve => {
      let accessedRoutes
      accessedRoutes = filterAsyncRoutes(appRouter, permisson)
      let path = ''
      let fristRouteParent = accessedRoutes.find(item => {
        return !!item.children
      })

      let fristRoute = fristRouteParent.children.find(element => {
        return !element.meta.notInMenu
      })
      //添加默认跳转页面
      let redirctRouter = {
        path: '/',
        redirect: fristRouteParent.path + '/' + fristRoute.path,
        meta: { title: fristRoute.meta.title, notInMenu: true }
      }
      accessedRoutes.unshift(redirctRouter)
      commit('setAccessRoutes', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('setToken', '')
      commit('setPermission', null)
      commit('setAccessRoutes', null)
      Util.removeToken()
      resolve()
    })
  }
}
