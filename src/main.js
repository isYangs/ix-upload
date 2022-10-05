import Vue from 'vue';
import App from './App.vue';
import {
    Row,
    Col,
    Button,
    Upload,
    Input,
    Tooltip,
    Loading,
    MessageBox,
    Dialog,
} from 'element-ui';
import './assets/css/reset.css';
import { encrypt, decrypt } from './utils/secret/index';

Vue.config.productionTip = false;
Vue.use(Row);
Vue.use(Col);
Vue.use(Button);
Vue.use(Upload);
Vue.use(Input);
Vue.use(Tooltip);
Vue.use(Loading);
Vue.use(Dialog);

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$encrypt = encrypt;
Vue.prototype.$decrypt = decrypt;

new Vue({
    render: h => h(App),
}).$mount('#app');
