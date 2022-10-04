<template>
    <el-upload
        class="upload"
        drag
        multiple
        list-type="picture"
        :limit="limit"
        :action="uploadFileUrl"
        :auto-upload="false"
        :headers="headers"
        :on-preview="handlePreview"
        :on-progress="handleProgress"
        :on-success="handleSuccess"
        :on-error="handleError"
    >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件，且不超过500kb
        </div>
    </el-upload>
</template>

<script>
import { decrypt } from '../utils/secret/index';
export default {
    name: 'UploadPic',
    props: {
        setConfig: {
            type: Object,
            require: true,
        },
    },
    data() {
        return {
            limit: 5,
            uploadFileUrl: 'https://i.xuewuzhibu.cn/api/v1/upload',
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer ' + decrypt(this.setConfig.config.token),
            },
        };
    },
    methods: {
        handlePreview(file) {
            console.log(file);
        },
        handleProgress(event, file, fileList) {
            console.log(event, file, fileList);
        },
        handleSuccess(res, file, fileList) {
            console.log(res, file, fileList);
        },
        handleError(err, file, fileList) {
            console.log(err, file, fileList);
        },
    },
};
</script>

<style scoped lang="less">
/deep/ .el-upload-list {
    display: flex;
    flex-wrap: wrap;
}
/deep/ .el-upload-list--picture {
    .el-upload-list__item {
        width: 200px;
    }
}
</style>
