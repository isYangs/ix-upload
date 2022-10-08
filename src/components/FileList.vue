<template>
    <ul class="upload__file_list">
        <li
            class="upload__file_item"
            v-for="(item, index) in file"
            :key="index"
        >
            <img :src="item.url" alt="" class="upload__file_list_thumbnail" />
            <span class="upload__file_list_name">{{ item.name }}</span>
            <div class="upload__file_list_btn_group">
                <el-button type="text">上传</el-button>
                <el-button type="text" @click="viewImage(index, file)">
                    查看
                </el-button>
            </div>
            <el-dialog
                title="查看图片"
                :visible.sync="dialogVisible"
                :width="dialogWidth"
                :key="dialogKey"
            >
                <img :src="previewImage" alt="" />
            </el-dialog>
            <i class="el-icon-close" @click="remove(item)"></i>
        </li>
    </ul>
</template>

<script>
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
            dialogVisible: false,
            previewImage: '',
            dialogWidth: '50%',
            file: this.fileData,
        };
    },
    methods: {
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
                    });
                })
                .catch(e => e);
        },
        viewImage(index, file) {
            console.log(file);
            this.previewImage = this.file[index].url;
            this.dialogVisible = true;
        },
    },
    watch: {
        fileData() {
            this.file = this.fileData.map(item => {
                item.key = this.$nanoid();
                return item;
            });
        },
    },
    computed: {
        dialogKey() {
            return this.dialogVisible ? this.$nanoid() : '';
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

        .upload__file_list_name {
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
