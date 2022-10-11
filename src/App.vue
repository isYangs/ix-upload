<template>
    <div id="app">
        <el-row>
            <el-col :span="12" :offset="6" class="setting">
                <el-input
                    v-model="input"
                    :disabled="!isEdit"
                    :placeholder="inputText"
                    ref="input"
                    @keyup.enter.native="save"
                    multiple
                ></el-input>
                <el-button
                    v-show="!isEdit"
                    type="primary"
                    icon="el-icon-edit"
                    @click="edit"
                >
                    编辑
                </el-button>
                <el-button v-show="isEdit" type="primary" @click="save">
                    保存
                </el-button>
                <el-button v-show="isEdit" type="danger" @click="cancel">
                    取消
                </el-button>
            </el-col>
            <el-col :span="12" :offset="6">
                <Upload :size="size" :limit="limit" :type="type" />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css';
import Upload from './components/UploadPic.vue';

export default {
    name: 'App',
    components: { Upload },
    data() {
        return {
            input: '',
            inputText: '请编辑用户Token',
            isEdit: false,
            limit: 5,
            size: 50, // 单位为mb
            type: [
                'jpg',
                'jpeg',
                'png',
                'gif',
                'bmp',
                'webp',
                'psd',
                'tif',
                'ico',
            ],
        };
    },
    methods: {
        // 编辑
        edit() {
            this.isEdit = true;
            this.inputText = '请输入用户Token';
            this.$nextTick(() => {
                this.$refs.input.focus();
            });
        },
        // 保存
        save() {
            if (this.input === '') {
                this.$message({
                    message: '请输入Token在保存',
                    type: 'warning',
                });
                return;
            }
            this.isEdit = false;
            this.$store.set('config', {
                token: this.$encrypt('Bearer ' + this.input),
            });
        },
        // 取消
        cancel() {
            this.isEdit = false;
            this.inputText = '请编辑用户Token';
        },
    },
    mounted() {
        if (this.$store.get('config', false)) {
            let token = this.$store.get('config', false).token;
            token = this.$decrypt(token);
            this.input = token.replace('Bearer ', '');
        }
    },
};
</script>

<style scoped lang="less">
#app {
    height: 100vh;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, PingFang SC,
        Microsoft YaHei UI, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,
        Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
}
.el-row {
    width: 100%;
    margin-top: 20px;
}
.setting {
    display: flex;
    *:not(:first-child) {
        margin-left: 10px;
    }
}
.upload {
    margin-top: 10px;
}
::v-deep .el-upload {
    width: 100%;
}
::v-deep .el-upload-dragger {
    width: 100%;
}
</style>
