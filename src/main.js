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
    Table,
    TableColumn,
    Select,
    Option,
} from 'element-ui';
import './assets/css/reset.css';
import { encrypt, decrypt } from '@/utils/secret';
import { store } from '@/utils/store';

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
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Select);
Vue.use(Option);

Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;
Vue.prototype.$encrypt = encrypt;
Vue.prototype.$decrypt = decrypt;
Vue.prototype.$store = store;

new Vue({
    render: h => h(App),
    beforeCreate() {
        Vue.prototype.$bus = this;
    },
}).$mount('#app');
