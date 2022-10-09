<template>
    <div class="upload">
        <el-upload
            drag
            multiple
            list-type="picture"
            :show-file-list="false"
            :action="url"
            :auto-upload="false"
            :headers="headers"
            :on-preview="handlePreview"
            :on-progress="handleProgress"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-remove="handleRemove"
            :file-list="fileList"
            :on-change="handleChange"
            :accept="accept"
        >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
                只能上传{{ limitType }}文件，且不超过{{ size }}MB
            </div>
        </el-upload>
        <FileList :fileData="fileData" />
    </div>
</template>

<script>
import FileList from './FileList.vue';
export default {
    name: 'UploadPic',
    components: { FileList },
    props: {
        limit: {
            type: Number,
            default: 5,
        },
        size: {
            type: Number,
            require: true,
        },
        type: {
            type: Array,
            require: true,
        },
        url: {
            type: String,
            require: true,
        },
        headers: {
            type: Object,
            require: true,
        },
    },
    data() {
        return {
            fileList: [],
            fileData: [],
        };
    },
    methods: {
        handleChange(file) {
            if (!localStorage.getItem('[USER_TOKEN]')) {
                this.$message.error('请先填写Token');
                return;
            }
            const fileSize = file.size / 1024 / 1024;
            if (fileSize > this.size) {
                this.$message.error('上传文件不能超过' + this.size + 'MB');
                return;
            }

            if (this.fileData.length >= this.limit) {
                this.$message.error('上传文件不能超过' + this.limit + '个');
                return;
            }

            let fileName = file.name;
            let fileSuffix = fileName.substring(fileName.lastIndexOf('.'));
            let fileType = this.type.map(item => '.' + item);
            if (fileType.indexOf(fileSuffix.toLowerCase()) === -1) {
                this.$message.error('上传文件类型不符合');
                return false;
            }
            this.fileData.push(file);
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
    computed: {
        // 遍历文件类型
        accept() {
            let fileType = this.type.map(item => '.' + item);
            return fileType.join(',');
        },
        // 拼接文件类型
        limitType() {
            return this.type.join('/');
        },
    },
};
</script>
