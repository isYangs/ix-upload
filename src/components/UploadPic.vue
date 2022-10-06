<template>
    <div class="upload">
        <el-upload
            drag
            multiple
            list-type="picture"
            :show-file-list="false"
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
            :on-change="handleChange"
            v-loading="loading"
            :accept="accept"
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
        <ul class="upload__file_list">
            <li
                class="upload__file_item"
                v-for="(item, index) in file"
                :key="index"
            >
                <img
                    :src="item.url"
                    alt=""
                    class="upload__file_list_thumbnail"
                />
                <span class="upload__file_lis_name">{{ item.name }}</span>
                <div class="upload__file_list_btn_group">
                    <el-button type="text">上传</el-button>
                    <el-button type="text" @click="viewImage(index)">
                        查看
                    </el-button>
                </div>
                <el-dialog title="查看图片" :visible.sync="dialogVisible">
                    <img :src="previewImage" alt="" />
                </el-dialog>
                <i class="el-icon-close" @click="remove(item)"></i>
            </li>
        </ul>
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
            headers: {
                Accept: 'application/json',
                Authorization:
                    'Bearer ' + this.$decrypt(this.setConfig.config.token),
            },
            fileList: [],
            fileType: [
                '.jpg',
                '.jpeg',
                '.png',
                '.gif',
                '.bmp',
                '.webp',
                '.psd',
                '.tif',
                '.ico',
            ],
            dialogVisible: false,
            file: [],
            previewImage: '',
        };
    },
    methods: {
        handleChange(file) {
            let fileName = file.name;
            let fileSuffix = fileName.substring(fileName.lastIndexOf('.'));
            if (this.fileType.indexOf(fileSuffix.toLowerCase()) === -1) {
                this.$message.error('上传文件类型不符合');
                return false;
            }
            this.file.push(file);
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
        remove(file) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    // 在file中删除
                    let index = this.file.indexOf(file);
                    this.file.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!',
                    });
                })
                .catch(e => e);
        },
        viewImage(index) {
            this.dialogVisible = true;
            this.previewImage = this.file[index].url;
        },
    },
    computed: {
        accept() {
            return this.fileType.join(',');
        },
    },
};
</script>

<style lang="less" scoped>
.upload__file_list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    .upload__file_item {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
        position: relative;
        display: flex;
        align-items: center;
        margin-top: 10px;

        .upload__file_list_thumbnail {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 5px;
        }

        .upload__file_lis_name {
            width: 100px;
            margin-left: 10px;
            font-size: 14px;
            color: #333;
            margin-right: auto;
            //溢出省略号
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .upload__file_list_btn_group {
            width: 100px;
        }
        i {
            position: absolute;
            top: 5px;
            right: 5px;
            cursor: pointer;
        }
        .el-dialog {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
    }
}
</style>
