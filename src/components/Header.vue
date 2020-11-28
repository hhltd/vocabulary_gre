<template>
  <div class="header">
    <div class="main">
      <!-- 左上角标题 点击返回首页 -->
      <div class="title" @click="goHome">GRE 2 Weeks</div>
      <!-- 右上角用户登录 未登录状态显示 -->
      <div class="user" @click="showMenu=!showMenu">
        <!-- template可以用div来替换 但div会被渲染成元素 
        使用template编译后不会被渲染成元素 一般和v-for以及v-show一起使用 使得整个html没有多余元素 结构更加清晰 -->
        <template v-if="user._id">
          <div>{{user.username}}</div>
          <span>{{user.username}}</span>
        </template>

        <template v-else>
          <div></div>
          <span>未登录</span>
        </template>
        <img src="../assets/icons/down.png" alt="">
      </div>
      <!-- 用户退出登录 -->
      <div class="menu" v-if="showMenu">
        <div class="menu-item" @click="userAction">{{user._id?'退出登录':'登录'}}</div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: 'Header',
  components: {

  }, 
  data(){
    return {
      showMenu: false
    }
  },
  computed: {
    user(){
      return this.$store.state.user
    }
  },
  methods: {
    goHome(){
      // 如果不在首页 返回首页
      return this.$route.path === '/home' || this.$router.replace('/home')
    },

    userAction(){
      //判断是否处于登录状态
      if (this.user._id) {
        if(confirm('确认退出登录？')) {
          this.$store.commit('logout')
          this.showMenu = false
        }
      } else {
        this.$event.emit('login')
        this.showMenu = false
      }
    }
  }
}
</script>

<style scoped>
  .header{
    position: absolute;
    top: 0;
    width: 100%;
    background:#40BC96;
    height: 80px;
    z-index: 1;
  }

  .main{
    position: relative;
    max-width: 1300px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title{
    font-size: 32px;
    font-weight: bolder;
    cursor: pointer;
    color: #FFFFFF;
    padding: 0 10px;
    box-sizing: border-box;
    font-family: Calibri, sans-serif;
    z-index: 10;
  }

  .user{
    height: 100%;
    display: flex;
    /* 使用 justify-content 属性对齐主轴上的各项（水平） */
    /* align-items 属性定义flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式 */
    align-items: center;
    padding-right: 10px;
    cursor: pointer;
  }

  .user div {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 2px;
    box-sizing: border-box;
    font-size: 12px;
    /* 属性增加或减少字符间的空白（字符间距） */
    letter-spacing: 0.5px;
    font-weight: 600;
    background: #248491;
    color: #FFFFFF;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, .24);
  }

  .user span {
    font-size: 10px;
    color: #FFFFFF;
    font-weight: 600;
    margin-left: 10px;
  }

  .user img {
    margin-left: 8px;
    width: 15px;
    height: 15px;
  }

  .menu {
    position: absolute;
    width: 180px;
    right: 0;
    top: 80px;
    box-shadow: -2px -2px 6px -2px rgba(0, 0, 0, .12);
    /* 设置弹出框渐变 */
    animation: blur 0.5s;
    /* animation-fill-mode 属性规定动画在播放之前或之后，其动画效果是否可见 */
    animation-fill-mode: both;
  }

  @keyframes blur {
    0%   { opacity: 0 }
    100% { opacity: 1 }
  }

  .menu-item {
    position: absolute;
    background: #FFFFFF;
    width: 100%;
    height: 40px;
    cursor: pointer;
    color: #2d3639;
    display: flex;
    align-items: center;
    padding-left: 15px;
    box-sizing: border-box;
    font-size: 15px;
    font-weight: 600;
    /* transition: property duration timing-function(ease 缓慢 先快后慢 先慢后快) delay */
    transition: all 0.4s ease;
    z-index: 11;
  }

  .menu-item:hover {
    background: #F9CC28;
  }

  .menu:after {
    background: #FFFFFF;
    content: '';
    position: absolute;
    right: 3px;
    top: -7px;
    transform: rotate(45deg);
    height: 15px;
    width: 15px;
    z-index: 10;
  }
</style>