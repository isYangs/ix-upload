<template>
    <div>
        <el-row>
            <el-col :span="12" :offset="6" class="setting">
                <el-input v-model="input" :disabled="!isEdit" :placeholder="inputText">
                    <template slot="prepend">图床用户Token</template>
                </el-input>
                <el-button v-show="!isEdit" type="primary" icon="el-icon-edit" @click="edit">编辑</el-button>
                <el-button v-show="isEdit" type="primary" @click="save">保存</el-button>
                <el-button v-show="isEdit" type="danger" @click="del">取消</el-button>
            </el-col>
            <el-col :span="12" :offset="6">
                <el-upload class="upload" drag :action="uploadFileUrl" :headers="headers" multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import secret from '../utils/secret/index';
export default {
    name: 'UploadImage',
    data() {
        return {
            input: '',
            inputText: '请先编辑用户Token',
            isEdit: false,
            uploadFileUrl: 'https://i.xuewuzhibu.cn/api/v1/upload',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
        };
    },
    methods: {
        edit() {
            this.isEdit = true;
            this.inputText = '请输入用户Token';
        },
        save() {
            this.isEdit = false;
            localStorage.setItem('token', secret.encrypt(this.input));
        },
        del() {
            this.isEdit = false;
        },
    },
    mounted() {
        console.log('secret',secret);
        let token = localStorage.getItem('token');
        if (token) {
            this.input = secret.decrypt(token);
        }
    },
};
</script>

<style scoped lang="less">
.el-row {
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
/deep/ .el-upload {
    width: 100%;
}
/deep/ .el-upload-dragger {
    width: 100%;
}
</style>
