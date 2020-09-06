import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: require('@/components/Home').default
  },
  {
    path: '/AppSettings',
    name: 'appsettings',
    component: require('@/components/AppSettings').default
  },
  {
    path: '*',
    redirect: '/'
  }]
});