<template>
    <div id="app">
        <Upload />
    </div>
</template>

<script>
import Upload from './components/UploadImage.vue';
export default {
    name: 'App',
    components: { Upload },
};
</script>

<style scoped lang="less">
#app {
    height: 100vh;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei UI, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif;
}
</style>
