import Home from '../views/common/Home.vue'
import i18n from '../locale'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'login.submit',
    noAuth: true
  },
  component: () => import('@/views/common/Login.vue')
}

export const page404 = {
  path: '/404',
  name: '404',
  meta: {
    title: '404',
    noAuth: true
  },
  component: () => import('@/views/common/404.vue')
}

export const page403 = {
  path: '/403',
  name: '403',
  meta: {
    title: '403',
    noAuth: true
  },
  component: () => import('@/views/common/403.vue')
}

export const refresh = {
  path: '/refresh',
  name: 'refresh',
  meta: {
    title: 'refresh',
    noAuth: true
  },
  component: () => import('@/components/common/Refresh.vue')
}

export const constantRoutes = [
  // redirctRouter,
  loginRouter,
  page403,
  page404,
  refresh
]

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/setup',
    component: Home,
    icon: 'fa fa-edit',
    meta: { title: 'menu.setup' },
    children: [
      {
        path: 'event',
        name: 'eventList',
        component: () => import('@/views/event/List.vue'),
        meta: { title: 'menu.eventSetup', permission: 'event.view' }
      },
      // {
      //   path: 'eventLog',
      //   name: 'eventLog',
      //   component: () => import('@/views/event/LogList.vue'),
      //   meta: { title: 'menu.eventLog' }
      // },
      {
        path: 'goal',
        name: 'goalList',
        component: () => import('@/views/goal/List.vue'),
        meta: { title: 'menu.goalSetup', permission: 'goal.view' }
      },
      {
        path: 'funnel',
        name: 'funnelList',
        component: () => import('@/views/funnel/List.vue'),
        meta: { title: 'menu.funnelSetup', permission: 'funnel.view' }
      }
    ]
  },
  {
    path: '/analysis',
    component: Home,
    icon: 'fa fa-tasks',
    meta: { title: 'menu.dashboard' },
    children: [
      {
        path: 'summary',
        name: 'propertySummary',
        component: () => import('@/views/summary/Property.vue'),
        meta: {
          title: 'menu.propertySummary',
          permission: 'analysissummary.view'
        }
      },
      {
        path: 'channel',
        name: 'channelAnalysis',
        component: () => import('@/views/channelAnalysis/Channel.vue'),
        meta: {
          title: 'menu.channelAnalysis',
          permission: 'analysischannel.view'
        }
      },
      {
        path: 'media',
        name: 'mediaAnalysis',
        component: () => import('@/views/mediaAnalysis/Media.vue'),
        meta: { title: 'menu.mediaAnalysis', permission: 'analysismedia.view' }
      },
      {
        path: 'goal',
        name: 'goalAnalysis',
        component: () => import('@/views/goalAnalysis/Goal.vue'),
        meta: { title: 'menu.goalAnalysis', permission: 'analysisgoal.view' }
      },
      {
        path: 'funnel',
        name: 'funnelAnalysis',
        component: () => import('@/views/funnelAnalysis/Funnel.vue'),
        meta: {
          title: 'menu.funnelAnalysis',
          permission: 'analysisfunnel.view'
        }
      }
    ]
  },
  {
    path: '/reports',
    component: Home,
    icon: 'fa fa-bar-chart',
    meta: { title: 'menu.reports' },
    children: [
      {
        path: 'event',
        name: 'eventReports',
        component: () => import('@/views/event/LogList.vue'),
        meta: { title: 'menu.eventReports', permission: 'reports.view' }
      },
      {
        path: 'download',
        name: 'downloadReports',
        component: () => import('@/views/downloadReport/List.vue'),
        meta: { title: 'menu.downloadReports', permission: 'eventlog.view' }
      }
    ]
  },
  {
    path: '/tools',
    component: Home,
    icon: 'fa el-icon-bangzhu',
    meta: { title: 'menu.tools' },
    children: [
      {
        path: 'generate',
        name: 'generate',
        component: () => import('@/views/tools/Generate.vue'),
        meta: { title: 'menu.generate', permission: 'generate.view' }
      }
    ]
  },
  {
    path: '/settings',
    component: Home,
    icon: 'fa el-icon-setting',
    meta: { title: 'menu.settings' },
    children: [
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/settings/Users.vue'),
        meta: { title: 'menu.users', permission: 'admin.users' }
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/views/settings/Roles.vue'),
        meta: { title: 'menu.roles', permission: 'admin.roles' }
      }
    ]
  },
  { path: '*', redirect: '/404', meta: { title: '404', notInMenu: true } }
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [...appRouter, ...constantRoutes]
