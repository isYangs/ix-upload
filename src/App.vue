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
                <Upload
                    :setConfig="setConfig"
                    :size="size"
                    :limit="limit"
                    :type="type"
                    :url="url"
                    :headers="headers"
                />
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
            setConfig: {
                config: {
                    token: this.$encrypt(this.input),
                },
                expires: Date.now() + 10000,
            },
            url: 'https://i.xuewuzhibu.cn/api/v1/upload',
            headers: {
                Accept: 'application/json',
                Authorization: '',
            },
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
        edit() {
            this.isEdit = true;
            this.inputText = '请输入用户Token';
            this.$nextTick(() => {
                this.$refs.input.focus();
            });
        },
        save() {
            // 判断edit是否为空
            if (this.input === '') {
                this.$message({
                    message: '请输入Token在保存',
                    type: 'warning',
                });
                return;
            }
            this.isEdit = false;
            this.setConfig.config.token = this.$encrypt(this.input);
            this.setConfig.expires = Date.now() + 10000;
        },
        cancel() {
            this.isEdit = false;
            this.inputText = '请编辑用户Token';
        },
        handleRemove(file) {
            console.log(file);
        },
        handleDownload(file) {
            console.log(file);
        },
    },
    watch: {
        setConfig: {
            deep: true,
            handler(val) {
                localStorage.setItem('[USER_TOKEN]', JSON.stringify(val));
                this.headers.Authorization = `Bearer ${this.$decrypt(
                    val.config.token
                )}`;
            },
        },
    },
    beforeDestroy() {
        if (this.setConfig.expires < Date.now()) {
            localStorage.removeItem('[USER_TOKEN]');
        }
    },
    mounted() {
        if (localStorage.getItem('[USER_TOKEN]')) {
            this.setConfig = JSON.parse(localStorage.getItem('[USER_TOKEN]'));
            this.input = this.$decrypt(this.setConfig.config.token);
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
