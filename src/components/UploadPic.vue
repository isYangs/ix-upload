<template>
    <div class="upload">
        <el-upload
            drag
            multiple
            :action="url"
            list-type="picture"
            :show-file-list="false"
            :auto-upload="false"
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
        <el-select v-model="permissionValue" placeholder="请选择">
            <el-option
                v-for="item in permission"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
        <FileList :fileData="fileData" :permissionValue="permissionValue" />
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
    },
    data() {
        return {
            url: process.env.VUE_APP_BASE_API + '/upload',
            fileList: [],
            fileData: [],
            permission: [
                {
                    label: '公开',
                    value: 1, // 根据接口文档 1 表示公开
                },
                {
                    label: '私有',
                    value: 0, // 根据接口文档 0 代表私有
                },
            ],
            permissionValue: 0,
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
                this.$message({
                    message: '上传文件大小不能超过' + this.size + 'MB!',
                    type: 'error',
                    center: true,
                });
                return;
            }

            if (this.fileData.length >= this.limit) {
                this.$message({
                    message: '上传文件数量不能超过' + this.limit + '个!',
                    type: 'error',
                    center: true,
                });
                return;
            }

            let fileName = file.name;
            let fileSuffix = fileName.substring(fileName.lastIndexOf('.'));
            let fileType = this.type.map(item => '.' + item);
            if (fileType.indexOf(fileSuffix.toLowerCase()) === -1) {
                this.$message({
                    message: '文件不符合上传类型',
                    type: 'error',
                    center: true,
                });
                return false;
            }
            this.fileData.push(file);
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

<style scoped lang="less">
.el-select {
    margin-top: 10px;
}
</style>
