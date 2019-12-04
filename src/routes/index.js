Vue.use(Router)

export default [
  {
    path: '/geneticAlgorithmInLabelPositioning',
    component: () => import('./geneticAlgorithmInLabelPositioning.vue'),
    meta: {title: '遗传算法优化标签展示位置'}
  },

  {
    path: '/collisionDetection/GJK/2',
    component: () => import('./collisionDetection/gjk.2.vue'),
    meta: {title: '碰撞检测 - GJK(2)'}
  },

  {
    path: '/collisionDetection/GJK/2/demo',
    component: () => import('./collisionDetection/gjk.2.demo.vue')
  },

  {
    path: '/collisionDetection/GJK/1/demo',
    component: () => import('./collisionDetection/gjk.1.demo.vue')
  },

  {
    path: '/collisionDetection/GJK/1',
    component: () => import('./collisionDetection/gjk.1.vue'),
    meta: {title: '碰撞检测 - GJK(1)'}
  },

  {
    path: '/webPerfFouc',
    component: () => import('./webPerfFouc.vue'),
    meta: {title: 'Web性能优化：FOUC'}
  },

  {
    path: '/',
    component: () => import('./entry.vue')
  },
]