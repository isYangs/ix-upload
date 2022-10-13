<template>
    <div class="upload">
        <el-upload
            drag
            multiple
            :action="url"
            list-type="picture"
            :show-file-list="false"
            :auto-upload="false"
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
        <div class="file__list_func" v-show="fileFuncShow">
            <el-button
                type="primary"
                icon="el-icon-upload"
                @click="uploadAll"
                plain
            >
                全部上传
            </el-button>
            <el-button
                type="danger"
                icon="el-icon-delete"
                @click="deleteAll"
                plain
            >
                清空列表
            </el-button>
            <el-select v-model="permissionValue" placeholder="请选择">
                <el-option
                    v-for="item in permission"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
        </div>
        <FileList
            :fileData="fileData"
            :permissionValue="permissionValue"
            ref="fileList"
        />
    </div>
</template>

<script>
import { upload } from '@/api';
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
            uploadResultAll: [],
            linksAll: [],
        };
    },
    methods: {
        // 上传文件校验并获取文件列表的数据
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
        // 上传全部文件
        uploadAll() {
            if (this.fileData.length === 0) {
                this.$message({
                    message: '请先选择文件',
                    type: 'error',
                    center: true,
                });
                return;
            }
            this.fileData.forEach(item => {
                let loadingInstance = this.$loading({
                    lock: true,
                    text: '正在拼命上传中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    target: document.querySelector(`.upload__file_list`),
                });
                const files = [];
                files.push(item.raw);
                upload
                    .uploadPic({
                        file: files[0],
                        permission: this.permissionValue,
                    })
                    .then(res => {
                        this.uploadResultAll.push(res.data);
                        this.uploadDataAll();
                        this.$refs.fileList.links = this.linksAll;
                        loadingInstance.close();
                    });
            });
        },
        deleteAll() {
            this.$confirm('此操作将永久清空所有文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.fileData.splice(0, this.fileData.length);
                    this.$message({
                        type: 'success',
                        message: '清空成功!',
                        duration: 2000,
                        center: true,
                    });
                })
                .catch(e => e);
        },

        uploadDataAll() {
            const uplaodDataAll = [];
            this.uploadResultAll.forEach(item => {
                for (const key in item.links) {
                    let data = {};
                    data = {
                        name: key,
                        url: item.links[key],
                    };
                    uplaodDataAll.push(data);
                }
                this.linksAll.push(uplaodDataAll);
            });
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
        // 是否显示文件列表功能
        fileFuncShow() {
            return this.fileData.length > 0;
        },
    },
};
</script>

<style scoped lang="less">
.file__list_func {
    margin-top: 10px;
    .el-select {
        width: 100px;
        margin-left: 10px;
    }
}
</style>
