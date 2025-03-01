<template>
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
        :style="{ left: (index / (steps.length - 1)) * 100 + '%' }"
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
  width: 85%;
  margin: 30px auto;
  padding: 10px 0;
}

.progress-line {
  position: relative;
  height: 4px;
  background-color: #e6ecfd;
  border-radius: 4px;
}

.step {
  position: absolute;
  bottom: 10px;
  transform: translateX(-50%);
  z-index: 2;
}

.step-number {
  background-color: #fff;
  border: 2px solid #e6ecfd;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #8a94a6;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.active {
  background: linear-gradient(135deg, #5b6af0, #7b89ff);
  color: #fff;
  border-color: #5b6af0;
  transform: scale(1.05);
  box-shadow: 0 3px 10px rgba(91, 106, 240, 0.2);
}

.progress {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #5b6af0, #7b89ff);
  border-radius: 4px;
  transition: width 0.5s ease;
  box-shadow: 0 1px 3px rgba(91, 106, 240, 0.3);
}

.descriptions {
  position: relative;
  margin-top: 20px;
}

.description {
  width: auto;
  position: absolute;
  transform: translateX(-50%);
  font-size: 14px;
  color: #5d6b82;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  white-space: nowrap;
}

/* 添加媒体查询以确保在小屏幕上的响应式布局 */
@media screen and (max-width: 375px) {
  .progress-bar-container {
    width: 90%;
  }
  
  .step-number {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }
  
  .description {
    font-size: 12px;
  }
}
</style>
