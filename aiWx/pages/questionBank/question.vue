<template>
  <view class="container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <u-icon name="arrow-left" color="#333" size="32"></u-icon>
      </view>
      <view class="title">题目详情</view>
    </view>
    
    <view class="question-card">
      <view class="question-type">
        {{ getQuestionType(question.type) }}
        <text class="difficulty">{{ getDifficultyLabel(question.difficulty) }}</text>
      </view>
      
      <view class="question-content">
        {{ question.content }}
      </view>
      
      <view class="options-list">
        <!-- 单选题 -->
        <view 
          v-if="question.type === 1"
          class="option-item"
          v-for="option in question.options"
          :key="option.optionId"
          :class="{
            'selected': userAnswer === option.optionId,
            'correct': question.isAnswered && option.isCorrect,
            'wrong': question.isAnswered && userAnswer === option.optionId && !option.isCorrect
          }"
          @click="selectOption(option.optionId)"
        >
          <view class="option-marker">{{ getOptionMarker(option.sortOrder) }}</view>
          <view class="option-content">{{ option.content }}</view>
          <view class="option-status" v-if="question.isAnswered">
            <u-icon 
              v-if="option.isCorrect" 
              name="checkmark-circle" 
              color="#52c41a" 
              size="40"
            ></u-icon>
            <u-icon 
              v-else-if="userAnswer === option.optionId" 
              name="close-circle" 
              color="#f5222d" 
              size="40"
            ></u-icon>
          </view>
        </view>
        
        <!-- 多选题 -->
        <view 
          v-if="question.type === 2"
          class="option-item"
          v-for="option in question.options"
          :key="option.optionId"
          :class="{
            'selected': isOptionSelected(option.optionId),
            'correct': question.isAnswered && option.isCorrect,
            'wrong': question.isAnswered && isOptionSelected(option.optionId) && !option.isCorrect
          }"
          @click="toggleOption(option.optionId)"
        >
          <view class="option-marker">{{ getOptionMarker(option.sortOrder) }}</view>
          <view class="option-content">{{ option.content }}</view>
          <view class="option-status" v-if="question.isAnswered">
            <u-icon 
              v-if="option.isCorrect" 
              name="checkmark-circle" 
              color="#52c41a" 
              size="40"
            ></u-icon>
            <u-icon 
              v-else-if="isOptionSelected(option.optionId)" 
              name="close-circle" 
              color="#f5222d" 
              size="40"
            ></u-icon>
          </view>
        </view>
        
        <!-- 判断题 -->
        <view 
          v-if="question.type === 3"
          class="option-item"
          v-for="option in question.options"
          :key="option.optionId"
          :class="{
            'selected': userAnswer === option.optionId,
            'correct': question.isAnswered && option.isCorrect,
            'wrong': question.isAnswered && userAnswer === option.optionId && !option.isCorrect
          }"
          @click="selectOption(option.optionId)"
        >
          <view class="option-marker">{{ option.content }}</view>
          <view class="option-status" v-if="question.isAnswered">
            <u-icon 
              v-if="option.isCorrect" 
              name="checkmark-circle" 
              color="#52c41a" 
              size="40"
            ></u-icon>
            <u-icon 
              v-else-if="userAnswer === option.optionId" 
              name="close-circle" 
              color="#f5222d" 
              size="40"
            ></u-icon>
          </view>
        </view>
        
        <!-- 填空题 -->
        <view v-if="question.type === 4" class="fill-blank">
          <input 
            type="text" 
            v-model="fillBlankAnswer" 
            placeholder="请输入答案" 
            :disabled="question.isAnswered"
          />
          <view class="fill-blank-status" v-if="question.isAnswered">
            <view v-if="question.isCorrect" class="correct-answer">
              <u-icon name="checkmark-circle" color="#52c41a" size="40"></u-icon>
              <text>回答正确</text>
            </view>
            <view v-else class="wrong-answer">
              <u-icon name="close-circle" color="#f5222d" size="40"></u-icon>
              <text>正确答案: {{ getCorrectAnswer() }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <view class="explanation-card" v-if="question.isAnswered && question.explanation">
      <view class="explanation-title">解析</view>
      <view class="explanation-content">{{ question.explanation }}</view>
    </view>
    
    <view class="action-btn" v-if="!question.isAnswered" @click="submitAnswer">
      提交答案
    </view>
    
    <view class="action-btn next" v-else @click="goToNextQuestion">
      下一题
    </view>
  </view>
</template>

<script>
import pageTime from '../../mixins/pageTime';

export default {
  mixins: [pageTime],
  data() {
    return {
      userId: '',
      questionId: '',
      question: {
        type: 1,
        content: '',
        options: [],
        isAnswered: false,
        isCorrect: false,
        explanation: ''
      },
      userAnswer: '',
      selectedOptions: [],
      fillBlankAnswer: '',
      startTime: 0,
      loading: false
    };
  },
  onLoad(options) {
    this.userId = uni.getStorageSync('userId');
    this.questionId = options.questionId;
    this.startTime = Date.now();
    
    this.loadQuestion();
  },
  mounted() {
    this.checkUserId();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    loadQuestion() {
      this.loading = true;
      uni.showLoading({ title: '加载中' });
      
      this.$api.questionBank.getQuestionDetail(this.userId, this.questionId)
        .then(res => {
          if (res.code === 0) {
            this.question = res.data || {};
            
            if (this.question.isAnswered) {
              this.userAnswer = this.question.userAnswer || '';
              
              if (this.question.type === 2) {
                this.selectedOptions = this.userAnswer.split(',');
              } else if (this.question.type === 4) {
                this.fillBlankAnswer = this.userAnswer;
              }
            }
          } else {
            uni.showToast({
              title: res.info || '获取题目失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取题目失败', err);
          uni.showToast({
            title: '获取题目失败，请稍后重试',
            icon: 'none'
          });
        })
        .finally(() => {
          this.loading = false;
          uni.hideLoading();
        });
    },
    selectOption(optionId) {
      if (this.question.isAnswered) return;
      
      this.userAnswer = optionId;
    },
    toggleOption(optionId) {
      if (this.question.isAnswered) return;
      
      const index = this.selectedOptions.indexOf(optionId);
      if (index === -1) {
        this.selectedOptions.push(optionId);
      } else {
        this.selectedOptions.splice(index, 1);
      }
    },
    isOptionSelected(optionId) {
      return this.selectedOptions.includes(optionId);
    },
    submitAnswer() {
      if (this.loading) return;
      
      let answer = '';
      
      if (this.question.type === 1 || this.question.type === 3) {
        answer = this.userAnswer;
        if (!answer) {
          uni.showToast({
            title: '请选择答案',
            icon: 'none'
          });
          return;
        }
      } else if (this.question.type === 2) {
        if (this.selectedOptions.length === 0) {
          uni.showToast({
            title: '请选择至少一个选项',
            icon: 'none'
          });
          return;
        }
        answer = this.selectedOptions.sort().join(',');
      } else if (this.question.type === 4) {
        answer = this.fillBlankAnswer.trim();
        if (!answer) {
          uni.showToast({
            title: '请输入答案',
            icon: 'none'
          });
          return;
        }
      }
      
      const answerTime = Math.floor((Date.now() - this.startTime) / 1000);
      
      this.loading = true;
      uni.showLoading({ title: '提交中' });
      
      this.$api.questionBank.submitAnswer({
        userId: this.userId,
        questionId: this.questionId,
        userAnswer: answer,
        answerTime: answerTime
      })
        .then(res => {
          if (res.code === 0) {
            const result = res.data;
            
            this.question.isAnswered = true;
            this.question.isCorrect = result.isCorrect;
            this.question.explanation = result.explanation;
            
            // 更新选项的正确状态
            if (this.question.type !== 4) {
              const correctAnswers = result.correctAnswer.split(',');
              this.question.options.forEach(option => {
                option.isCorrect = correctAnswers.includes(option.optionId);
              });
            }
            
            uni.showToast({
              title: result.isCorrect ? '回答正确' : '回答错误',
              icon: result.isCorrect ? 'success' : 'none'
            });
          } else {
            uni.showToast({
              title: res.info || '提交答案失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('提交答案失败', err);
          uni.showToast({
            title: '提交答案失败，请稍后重试',
            icon: 'none'
          });
        })
        .finally(() => {
          this.loading = false;
          uni.hideLoading();
        });
    },
    goToNextQuestion() {
      // 这里可以实现跳转到下一题的逻辑
      // 如果是从练习页面进来的，可以返回上一页，由练习页面加载下一题
      uni.navigateBack();
    },
    getQuestionType(type) {
      const types = {
        1: '单选题',
        2: '多选题',
        3: '判断题',
        4: '填空题'
      };
      return types[type] || '未知类型';
    },
    getDifficultyLabel(difficulty) {
      const difficulties = {
        1: '简单',
        2: '中等',
        3: '困难'
      };
      return difficulties[difficulty] || '未知难度';
    },
    getOptionMarker(index) {
      return String.fromCharCode(65 + index); // A, B, C, D...
    },
    getCorrectAnswer() {
      if (!this.question.options) return '';
      
      for (const option of this.question.options) {
        if (option.isCorrect) {
          return this.question.type === 4 ? option.content : option.optionId;
        }
      }
      
      return '';
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
  padding-bottom: 150rpx;
}

.header {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  margin-bottom: 30rpx;
  
  .back-btn {
    margin-right: 20rpx;
  }
  
  .title {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
  }
}

.question-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .question-type {
    font-size: 28rpx;
    color: #5b6af0;
    margin-bottom: 20rpx;
    
    .difficulty {
      margin-left: 20rpx;
      font-size: 24rpx;
      color: #999;
      background-color: #f5f5f5;
      padding: 6rpx 16rpx;
      border-radius: 6rpx;
    }
  }
  
  .question-content {
    font-size: 34rpx;
    color: #333;
    line-height: 1.6;
    margin-bottom: 40rpx;
  }
  
  .options-list {
    .option-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      border-radius: 12rpx;
      background-color: #f9f9f9;
      margin-bottom: 20rpx;
      position: relative;
      
      &.selected {
        background-color: #f0f2ff;
        border: 2rpx solid #5b6af0;
      }
      
      &.correct {
        background-color: #f6ffed;
        border: 2rpx solid #52c41a;
      }
      
      &.wrong {
        background-color: #fff1f0;
        border: 2rpx solid #f5222d;
      }
      
      .option-marker {
        width: 60rpx;
        height: 60rpx;
        border-radius: 30rpx;
        background-color: #eee;
        color: #666;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 28rpx;
        font-weight: bold;
        margin-right: 20rpx;
        
        .selected & {
          background-color: #5b6af0;
          color: #fff;
        }
      }
      
      .option-content {
        flex: 1;
        font-size: 30rpx;
        color: #333;
      }
      
      .option-status {
        margin-left: 20rpx;
      }
    }
    
    .fill-blank {
      margin-top: 20rpx;
      
      input {
        width: 100%;
        height: 80rpx;
        border: 2rpx solid #ddd;
        border-radius: 12rpx;
        padding: 0 20rpx;
        font-size: 30rpx;
        color: #333;
        
        &:disabled {
          background-color: #f9f9f9;
        }
      }
      
      .fill-blank-status {
        margin-top: 20rpx;
        display: flex;
        align-items: center;
        
        .correct-answer, .wrong-answer {
          display: flex;
          align-items: center;
          
          text {
            margin-left: 10rpx;
            font-size: 28rpx;
          }
        }
        
        .correct-answer {
          color: #52c41a;
        }
        
        .wrong-answer {
          color: #f5222d;
        }
      }
    }
  }
}

.explanation-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .explanation-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    border-left: 8rpx solid #5b6af0;
    padding-left: 20rpx;
  }
  
  .explanation-content {
    font-size: 30rpx;
    color: #666;
    line-height: 1.6;
  }
}

.action-btn {
  position: fixed;
  bottom: 50rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 90rpx;
  background-color: #5b6af0;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
  border-radius: 45rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6rpx 16rpx rgba(91, 106, 240, 0.4);
  
  &.next {
    background-color: #52c41a;
    box-shadow: 0 6rpx 16rpx rgba(82, 196, 26, 0.4);
  }
}
</style>
