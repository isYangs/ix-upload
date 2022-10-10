<template>
    <ul class="upload__file_list">
        <div
            v-for="(item, index) in file"
            :class="`upload_file_item list__item_${index}`"
            :key="index"
        >
            <li class="upload__file_item">
                <img
                    :src="item.url"
                    alt=""
                    class="upload__file_list_thumbnail"
                />
                <span class="upload__file_list_name">{{ item.name }}</span>
                <div class="upload__file_list_btn_group">
                    <el-button type="text" @click="upload(index)">
                        上传
                    </el-button>
                    <el-button type="text" @click="viewImage(index)">
                        查看
                    </el-button>
                </div>
                <i class="el-icon-close" @click="remove(item)"></i>
            </li>
        </div>
        <el-dialog
            title="查看图片"
            :visible.sync="dialogVisible"
            v-if="dialogVisible"
            width="45%"
        >
            <img :src="previewImage" alt="" />
        </el-dialog>
    </ul>
</template>

<script>
import { upload } from '@/api';
import { Loading } from 'element-ui';
export default {
    name: 'FileList',
    props: {
        fileData: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            loading: true,
            dialogVisible: false,
            previewImage: '',
            file: this.fileData,
            fileList: [],
            uploadResult: [],
        };
    },
    methods: {
        // 查看图片
        viewImage(index) {
            this.previewImage = this.file[index].url;
            this.dialogVisible = true;
        },
        // 上传图片
        upload(index) {
            if (this.fileList.length > 0) {
                this.repeatUpload(index);
                return;
            }
            this.uploadPic(index);
        },
        // 删除图片
        remove(file) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    let index = this.file.indexOf(file);
                    this.file.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!',
                        duration: 2000,
                        center: true,
                    });
                })
                .catch(e => e);
        },
        uploadPic(index) {
            let loadingInstance = Loading.service({
                lock: true,
                text: '上传中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector(`.list__item_${index}`),
            });
            const files = [];
            files.push(this.file[index].raw);
            upload
                .uploadPic({ file: files[0] })
                .then(res => {
                    this.uploadResult.push(res.data);
                    this.fileList.push({
                        name: res.data.name,
                        url: res.data.links.url,
                    });
                    this.uploadSuccess = setTimeout(() => {
                        loadingInstance.close();
                        this.$message({
                            type: 'success',
                            message: '上传成功',
                            duration: 4000,
                            center: true,
                        });
                    }, 1000);
                })
                .catch(() => {
                    this.uploadError = setTimeout(() => {
                        loadingInstance.close();
                        this.$message({
                            type: 'error',
                            message: '上传失败',
                            duration: 4000,
                            center: true,
                        });
                    }, 1000);
                });
        },
        // 重复上传
        repeatUpload(index) {
            console.log('aaaaa@');
            for (let i = 0; i < this.uploadResult.length; i++) {
                if (
                    this.uploadResult[i].origin_name === this.file[index].name
                ) {
                    console.log('正在执行3');
                    this.$message({
                        message: '该文件已经上传',
                        type: 'warning',
                        duration: 2000,
                        center: true,
                    });
                } else {
                    this.uploadPic(index);
                }
            }
        },
    },
    beforeDestroy() {
        clearTimeout(this.uploadSuccess);
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
    .upload_file_item {
        width: 100%;
        height: 100%;
        margin-top: 10px;
        box-sizing: border-box;

        .upload__file_item {
            width: 100%;
            height: 100%;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px 0;
            position: relative;
            display: flex;
            align-items: center;
            box-sizing: border-box;

            .upload__file_list_thumbnail {
                width: 60px;
                height: 60px;
                object-fit: cover;
                border-radius: 5px;
                margin-left: 10px;
            }

            .upload__file_list_name {
                width: 100px;
                margin-left: 10px;
                font-size: 14px;
                color: #333;
                margin-right: auto;
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
        }
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
</style>
