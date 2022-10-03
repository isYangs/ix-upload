import Vue from 'vue';
import App from './App.vue';
import { Row, Col,Button, Upload, Input } from 'element-ui';
import './assets/css/reset.css';

Vue.config.productionTip = false;

Vue.use(Row);
Vue.use(Col);
Vue.use(Button);
Vue.use(Upload);
Vue.use(Input);

new Vue({
    render: (h) => h(App),
}).$mount('#app');
