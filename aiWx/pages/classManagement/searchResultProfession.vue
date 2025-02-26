<template>
  <view class="result-box">
    <menuNavigate v-if="showNavigator" class="menu-navigator"></menuNavigate>
    <view class="control">
      <image src="/static/classroom/classManagement/control.png" class="control-icon" @click="showNavigator=!showNavigator"></image>
    </view>
    <aiConnection class="connection"></aiConnection>  
  </view>
</template>

<script>
import menuNavigate from './components/menuNavigate.vue';
import aiConnection from './components/aiConnection.vue';
// import AiConnection from './components/aiConnection.vue';
export default{
  components:{
    menuNavigate,
    aiConnection
  },
  data() {
    return {
      showNavigator:false
    }
  }            
}
</script>

<style scoped lang="scss">
.result-box{
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  

  .menu-navigator{
    // visibility: hidden;
    // display: none;
    position: relative;
    width: 40vw;
    min-height: 100vh;
    // background-color: #f3f3f378;
    background-color: #e8e8e878;
    border-radius: 0 50rpx 50rpx 0;
    transition:opacity 0.5s ease;
  }
  
  .control{
    top: 50%;
    left: 0;
    position: relative;
    // transform: translate(0, -50%);
    transform: translate(-50%,0);
    .control-icon{
      width: 45rpx;
      height: 45rpx;
    }
  }
}
.connection{
  flex: 1;
  min-height: 100vh;
}
.hidden{
  display: none;
}
</style>