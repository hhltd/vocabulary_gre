<template>
  <div id="app">
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from '@/components/Header'
export default {
  name: 'App',
  components: {
    Header
  },
}
</script>

<style>
/* 公共样式 由于比较少 不另外新建外部css文件 */
  body {
    padding: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    user-select: none;
  } 
</style>
