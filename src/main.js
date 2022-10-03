import Vue from 'vue';
import App from './App.vue';
import { Upload,Row,Col } from 'element-ui';

Vue.config.productionTip = false;

Vue.use(Upload);
Vue.use(Row);
Vue.use(Col);

new Vue({
    render: (h) => h(App),
}).$mount('#app');
