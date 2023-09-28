const component = {
  install: function (Vue) {
    Vue.component('PageElement', () => import('./PageElement.vue'));
    Vue.component('MyElement', () => import('./MyElement.vue'));
    Vue.component('FooterElement', () => import('./FooterElement.vue'))
  }
};

export default component
