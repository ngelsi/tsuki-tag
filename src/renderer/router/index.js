import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: require('@/components/Home').default,
    props: {
      provider: 'online'
    },
  },
  {
    path: '/online',
    name: 'online',
    component: require('@/components/Online').default,
    props: {
      provider: 'online'
    }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: require('@/components/Favorites').default,
    props: {
      provider: 'favorites'
    }
  },
  {
    path: '/workspaces',
    name: 'workspaces',
    component: require('@/components/Workspaces').default,
    props: {
      provider: 'workspaces'
    }
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