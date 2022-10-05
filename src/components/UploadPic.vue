<template>
    <div class="upload">
        <el-upload
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
            :before-remove="handleRemove"
            :file-list="fileList"
            v-loading="loading"
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
    </div>
</template>

<script>
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
            loading: false,
            uploadFileUrl: 'https://i.xuewuzhibu.cn/api/v1/upload',
            fileList: [],
            headers: {
                Accept: 'application/json',
                Authorization:
                    'Bearer ' + this.$decrypt(this.setConfig.config.token),
            },
            dialogVisible: false,
        };
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(() => {
                    done();
                })
                .catch(() => {});
        },
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
        handleRemove(file, fileList) {
            this.fileList = fileList;
            return this.$confirm(`确定移除 ${file.name}？`);
        },
    },
};
</script>
