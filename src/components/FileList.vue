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
            <el-table
                :data="links[index]"
                style="width: 100%"
                empty-text="暂无图片链接，请先上传图片！"
            >
                <el-table-column label="格式" width="170">
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">
                            {{ scope.row.name }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="链接">
                    <template slot-scope="scope">
                        <div
                            slot="reference"
                            class="name-wrapper"
                            v-html="scope.row.url"
                        ></div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleCopy(scope.row)">
                            <i class="el-icon-document-copy"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
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
        permissionValue: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            index: 0,
            loading: true,
            dialogVisible: false,
            previewImage: '',
            file: this.fileData,
            fileList: [],
            uploadResult: [],
            links: [],
            tableData: [],
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
                text: '正在拼命上传中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)',
                target: document.querySelector(`.list__item_${index}`),
            });
            const files = [];
            files.push(this.file[index].raw);
            upload
                .uploadPic({ file: files[0], permission: this.permissionValue })
                .then(res => {
                    this.uploadResult.push(res.data);
                    this.fileList.push({
                        name: res.data.name,
                        url: res.data.links.url,
                    });
                    this.uploadSuccess = setTimeout(() => {
                        this.$message({
                            type: 'success',
                            message: '上传成功',
                            duration: 4000,
                            center: true,
                        });
                        this.uploadData(index);
                        loadingInstance.close();
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
            for (let i = 0; i < this.uploadResult.length; i++) {
                if (
                    this.uploadResult[i].origin_name === this.file[index].name
                ) {
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
        // 返回上传结果
        uploadData(index) {
            const uplaodData = [];
            for (let key in this.uploadResult[index].links) {
                let data = {};
                data = {
                    name: key,
                    url: this.uploadResult[index].links[key],
                };
                uplaodData.push(data);
            }
            this.links.push(uplaodData);
        },
        // 复制链接
        handleCopy(row) {
            // 判断如果复制的是html链接，把&lt;替换为<，把&gt;替换为>
            if (row.name === 'html') {
                let html = row.url.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                this.copy(html);
            } else {
                this.copy(row.url);
            }
        },
        // 复制
        copy(data) {
            this.$copyText(data).then(
                () => {
                    this.$message({
                        message: '复制成功',
                        type: 'success',
                        duration: 2000,
                        center: true,
                    });
                },
                () => {
                    this.$message({
                        message: '复制失败',
                        type: 'error',
                        duration: 2000,
                        center: true,
                    });
                }
            );
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
