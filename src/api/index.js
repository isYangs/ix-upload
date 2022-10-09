/**
 * api接口列表
 */
import request from '@/utils/request';

export const upload = {
    // 上传文件
    uploadPic(data) {
        return request({
            url: '/upload',
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data,
        });
    },
    // 获取文件列表
    getPic() {
        return request({
            url: '/images',
        });
    },
    // 删除文件
    delPic(params) {
        return request({
            url: '/images',
            method: 'delete',
            params,
        });
    },
};
