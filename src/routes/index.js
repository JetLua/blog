Vue.use(Router)

export default [
  {path: '/webPerfFouc', component: () => import('./webPerfFouc.vue')},
  {path: '/collisionDetection/JGK/1', component: () => import('./collisionDetection/gjk.1.vue')}
]