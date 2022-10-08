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
    Message,
    Dialog,
    Image,
    Progress,
} from 'element-ui';
import './assets/css/reset.css';
import { encrypt, decrypt } from './utils/secret';
import { storage } from './utils/storage';
import { nanoid } from 'nanoid';

Vue.config.productionTip = false;
Vue.use(Row);
Vue.use(Col);
Vue.use(Button);
Vue.use(Upload);
Vue.use(Input);
Vue.use(Tooltip);
Vue.use(Loading);
Vue.use(Dialog);
Vue.use(Image);
Vue.use(Progress);

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.prototype.$encrypt = encrypt;
Vue.prototype.$decrypt = decrypt;
Vue.prototype.$storage = storage;
Vue.prototype.$nanoid = nanoid;

new Vue({
    render: h => h(App),
    beforeCreate() {
        Vue.prototype.$bus = this;
    },
}).$mount('#app');
