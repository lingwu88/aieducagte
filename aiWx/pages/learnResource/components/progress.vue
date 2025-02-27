
<template>
  <div class="progress-bar-container">
    <div class="progress-bar">
      <div 
        class="progress"
        :style="{'width':progress+'vw'}"
        >
      </div>
    </div>
    <div class="nodes">
      <div
        v-for="(node,index) in nodes"
        :key="index"
        class="node"
        :class="{ative:index <= currentStep}"
      >
      <span>{{ node.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props:{
      progress:{
        type:Number,
        required:true,
        default:0
      },
      nodes:{
        type:Array,
        required:true
      },
      currentStep:{
        type:Number,
        requiredL:true,
        default:0
      }
    }
  }
</script>

<style scoped lang="scss">
.progress-bar-container{
  width:100%;
  margin:20px 0;
}
.progress-bar{
  width:100%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 20px;
  overflow: hidden;
}
.progress{
  height: 100%;
  background-color: #76c7c8;
  transition:width 0.3s ease;
}
.nodes{
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.node{
  position:relative;
  text-align:center;
}
.node-active{
  font-weight: bold;
  color:#76c7c8;
}
.node::after{
  position: absolute;
  content:'';
  width:100%;
  height:2px;
  background-color: #e0e0e0;
  top:50%;
  left: 0;
  z-index: -1;
}
.node.active::after{
  background-color: #76c7c0;
}
</style> --><template>
  <div class="progress-bar-container">
    <div class="progress-line">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step"
        :style="{ left: (index / (steps.length - 1)) *100  + '%' }"
      >
        <span 
          class="step-number"
          :class="{'active':index <= currentStep}"
        >{{ index + 1 }}</span>
      </div>
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
    <div class="descriptions">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="description"
        :style="{ left: (index / (steps.length - 1)) * 100 + (steps.length-index)*5 + '%' }"
      >
        {{ step.label }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      required: true,
      default: 0
    },
    steps: {
      type: Array,
      required: true
    },
    currentStep:{
      type:Number,
      required:true,
      default:0
    }
  }
};
</script>

<style scoped>
.progress-bar-container {
  position: relative;
  width: 100%;
  margin: 20px 0;
}

.progress-line {
  position: relative;
  height: 2px; /* 细横线的高度 */
  background-color: #e0e0e0; /* 横线颜色 */
}

.step {
  position: absolute;
  bottom: 10px; /* 数字与横线的距离 */
  transform: translateX(-50%);
}

.step-number {
  background-color: #fff; /* 数字背景 */
  border: 1px solid #76c7c0; /* 数字边框 */
  border-radius: 50%; /* 圆形 */
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #76c7c0; /* 数字颜色 */
}
.active{
  background-color: #76c7c0;
  color:#fff;
}
.progress {
  position: absolute;
  height: 100%;
  background-color: #76c7c0; /* 进度条颜色 */
  transition: width 0.3s ease; /* 动画效果 */
}

.descriptions {
  position: relative;
  margin-top: 10px; /* 描述与横线的距离 */
}

.description {
  width:30%;
  position: absolute;
  transform: translateX(-50%);
  font-size: 12px;
  color: #333; /* 描述文字颜色 */
}
</style>
```
