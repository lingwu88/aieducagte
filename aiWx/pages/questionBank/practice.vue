<template>
  <view class="container">
    <view class="header">
      <view class="back-btn" @click="confirmExit">
        <u-icon name="arrow-left" color="#333" size="32"></u-icon>
      </view>
      <view class="title">{{ practiceTitle }}</view>
      <view class="progress">{{ currentIndex + 1 }}/{{ totalQuestions }}</view>
    </view>
    
    <view class="progress-bar">
      <view 
        class="progress-inner" 
        :style="{ width: ((currentIndex + 1) / totalQuestions * 100) + '%' }"
      ></view>
    </view>
    
    <swiper 
      class="question-swiper" 
      :current="currentIndex" 
      @change="handleSwiperChange" 
      :disable-touch="true"
    >
      <swiper-item v-for="(question, index) in questions" :key="question.questionId">
        <scroll-view scroll-y class="question-scroll">
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
                  'selected': userAnswers[index] === option.optionId,
                  'correct': answeredQuestions[index] && option.isCorrect,
                  'wrong': answeredQuestions[index] && userAnswers[index] === option.optionId && !option.isCorrect
                }"
                @click="selectOption(index, option.optionId)"
              >
                <view class="option-marker">{{ getOptionMarker(option.sortOrder) }}</view>
                <view class="option-content">{{ option.content }}</view>
                <view class="option-status" v-if="answeredQuestions[index]">
                  <u-icon 
                    v-if="option.isCorrect" 
                    name="checkmark-circle" 
                    color="#52c41a" 
                    size="40"
                  ></u-icon>
                  <u-icon 
                    v-else-if="userAnswers[index] === option.optionId" 
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
                  'selected': isOptionSelected(index, option.optionId),
                  'correct': answeredQuestions[index] && option.isCorrect,
                  'wrong': answeredQuestions[index] && isOptionSelected(index, option.optionId) && !option.isCorrect
                }"
                @click="toggleOption(index, option.optionId)"
              >
                <view class="option-marker">{{ getOptionMarker(option.sortOrder) }}</view>
                <view class="option-content">{{ option.content }}</view>
                <view class="option-status" v-if="answeredQuestions[index]">
                  <u-icon 
                    v-if="option.isCorrect" 
                    name="checkmark-circle" 
                    color="#52c41a" 
                    size="40"
                  ></u-icon>
                  <u-icon 
                    v-else-if="isOptionSelected(index, option.optionId)" 
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
                  'selected': userAnswers[index] === option.optionId,
                  'correct': answeredQuestions[index] && option.isCorrect,
                  'wrong': answeredQuestions[index] && userAnswers[index] === option.optionId && !option.isCorrect
                }"
                @click="selectOption(index, option.optionId)"
              >
                <view class="option-marker">{{ option.content }}</view>
                <view class="option-status" v-if="answeredQuestions[index]">
                  <u-icon 
                    v-if="option.isCorrect" 
                    name="checkmark-circle" 
                    color="#52c41a" 
                    size="40"
                  ></u-icon>
                  <u-icon 
                    v-else-if="userAnswers[index] === option.optionId" 
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
                  v-model="fillBlankAnswers[index]" 
                  placeholder="请输入答案" 
                  :disabled="answeredQuestions[index]"
                />
                <view class="fill-blank-status" v-if="answeredQuestions[index]">
                  <view v-if="correctQuestions[index]" class="correct-answer">
                    <u-icon name="checkmark-circle" color="#52c41a" size="40"></u-icon>
                    <text>回答正确</text>
                  </view>
                  <view v-else class="wrong-answer">
                    <u-icon name="close-circle" color="#f5222d" size="40"></u-icon>
                    <text>正确答案: {{ getCorrectAnswer(index) }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          
          <view class="explanation-card" v-if="answeredQuestions[index] && question.explanation">
            <view class="explanation-title">解析</view>
            <view class="explanation-content">{{ question.explanation }}</view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
    
    <view class="action-buttons">
      <view class="action-btn prev" v-if="currentIndex > 0" @click="prevQuestion">
        上一题
      </view>
      
      <view 
        class="action-btn submit" 
        v-if="!answeredQuestions[currentIndex]" 
        @click="submitAnswer"
      >
        提交答案
      </view>
      
      <view 
        class="action-btn next" 
        v-else-if="currentIndex < questions.length - 1" 
        @click="nextQuestion"
      >
        下一题
      </view>
      
      <view 
        class="action-btn finish" 
        v-else-if="currentIndex === questions.length - 1 && answeredQuestions[currentIndex]" 
        @click="finishPractice"
      >
        完成练习
      </view>
    </view>
    
    <!-- 退出确认弹窗 -->
    <u-popup :show="showExitConfirm" mode="center" :round="10" @close="showExitConfirm = false">
      <view class="exit-popup">
        <view class="exit-title">确认退出</view>
        <view class="exit-content">退出后，当前练习进度将不会保存</view>
        <view class="exit-buttons">
          <view class="exit-cancel" @click="showExitConfirm = false">取消</view>
          <view class="exit-confirm" @click="exitPractice">确认退出</view>
        </view>
      </view>
    </u-popup>
    
    <!-- 练习结果弹窗 -->
    <u-popup :show="showResult" mode="center" :round="10" @close="showResult = false">
      <view class="result-popup">
        <view class="result-title">练习完成</view>
        <view class="result-stats">
          <view class="result-item">
            <text class="result-value">{{ questions.length }}</text>
            <text class="result-label">总题数</text>
          </view>
          <view class="result-item">
            <text class="result-value">{{ correctCount }}</text>
            <text class="result-label">正确</text>
          </view>
          <view class="result-item">
            <text class="result-value">{{ wrongCount }}</text>
            <text class="result-label">错误</text>
          </view>
          <view class="result-item">
            <text class="result-value">{{ correctRate }}%</text>
            <text class="result-label">正确率</text>
          </view>
        </view>
        <view class="result-buttons">
          <view class="result-btn retry" @click="retryPractice">重新练习</view>
          <view class="result-btn back" @click="backToCategory">返回</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import pageTime from '../../mixins/pageTime';

export default {
  mixins: [pageTime],
  data() {
    return {
      userId: '',
      categoryId: '',
      difficulty: 0,
      practiceTitle: '练习模式',
      questions: [],
      currentIndex: 0,
      totalQuestions: 10,
      userAnswers: [],
      selectedOptionsArray: [],
      fillBlankAnswers: [],
      answeredQuestions: [],
      correctQuestions: [],
      startTimes: [],
      showExitConfirm: false,
      showResult: false,
      correctCount: 0,
      wrongCount: 0,
      correctRate: 0,
      loading: false
    };
  },
  onLoad(options) {
    this.userId = uni.getStorageSync('userId');
    
    if (options.categoryId) {
      this.categoryId = options.categoryId;
      this.practiceTitle = '分类练习';
    }
    
    if (options.difficulty) {
      this.difficulty = parseInt(options.difficulty);
      this.practiceTitle = `${this.getDifficultyLabel(this.difficulty)}难度练习`;
    }
    
    this.loadQuestions();
  },
  mounted() {
    this.checkUserId();
  },
  methods: {
    loadQuestions() {
      this.loading = true;
      uni.showLoading({ title: '加载中' });
      
      const params = {
        userId: this.userId,
        limit: this.totalQuestions
      };
      
      if (this.categoryId) {
        params.categoryId = this.categoryId;
      }
      
      if (this.difficulty > 0) {
        params.difficulty = this.difficulty;
      }
      
      this.$api.questionBank.getQuestionList(params)
        .then(res => {
          if (res.code === 0) {
            this.questions = res.data || [];
            this.initQuestionData();
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
    initQuestionData() {
      this.userAnswers = new Array(this.questions.length).fill('');
      this.selectedOptionsArray = new Array(this.questions.length).fill(null).map(() => []);
      this.fillBlankAnswers = new Array(this.questions.length).fill('');
      this.answeredQuestions = new Array(this.questions.length).fill(false);
      this.correctQuestions = new Array(this.questions.length).fill(false);
      this.startTimes = new Array(this.questions.length).fill(Date.now());
    },
    handleSwiperChange(e) {
      this.currentIndex = e.detail.current;
    },
    selectOption(index, optionId) {
      if (this.answeredQuestions[index]) return;
      
      this.userAnswers[index] = optionId;
    },
    toggleOption(index, optionId) {
      if (this.answeredQuestions[index]) return;
      
      const options = this.selectedOptionsArray[index];
      const optionIndex = options.indexOf(optionId);
      
      if (optionIndex === -1) {
        options.push(optionId);
      } else {
        options.splice(optionIndex, 1);
      }
    },
    isOptionSelected(index, optionId) {
      return this.selectedOptionsArray[index].includes(optionId);
    },
    submitAnswer() {
      if (this.loading) return;
      
      const index = this.currentIndex;
      const question = this.questions[index];
      let answer = '';
      
      if (question.type === 1 || question.type === 3) {
        answer = this.userAnswers[index];
        if (!answer) {
          uni.showToast({
            title: '请选择答案',
            icon: 'none'
          });
          return;
        }
      } else if (question.type === 2) {
        const options = this.selectedOptionsArray[index];
        if (options.length === 0) {
          uni.showToast({
            title: '请选择至少一个选项',
            icon: 'none'
          });
          return;
        }
        answer = options.sort().join(',');
      } else if (question.type === 4) {
        answer = this.fillBlankAnswers[index].trim();
        if (!answer) {
          uni.showToast({
            title: '请输入答案',
            icon: 'none'
          });
          return;
        }
      }
      
      const answerTime = Math.floor((Date.now() - this.startTimes[index]) / 1000);
      
      this.loading = true;
      uni.showLoading({ title: '提交中' });
      
      this.$api.questionBank.submitAnswer({
        userId: this.userId,
        questionId: question.questionId,
        userAnswer: answer,
        answerTime: answerTime
      })
        .then(res => {
          if (res.code === 0) {
            const result = res.data;
            
            this.answeredQuestions[index] = true;
            this.correctQuestions[index] = result.isCorrect;
            this.questions[index].explanation = result.explanation;
            
            // 更新选项的正确状态
            if (question.type !== 4) {
              const correctAnswers = result.correctAnswer.split(',');
              this.questions[index].options.forEach(option => {
                option.isCorrect = correctAnswers.includes(option.optionId);
              });
            }
            
            // 自动前进到下一题
            if (index < this.questions.length - 1) {
              setTimeout(() => {
                this.nextQuestion();
              }, 1500);
            } else {
              // 最后一题完成后显示结果
              this.calculateResults();
            }
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
    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex -= 1;
      }
    },
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex += 1;
      }
    },
    finishPractice() {
      this.calculateResults();
      this.showResult = true;
    },
    calculateResults() {
      this.correctCount = this.correctQuestions.filter(Boolean).length;
      this.wrongCount = this.answeredQuestions.filter(Boolean).length - this.correctCount;
      this.correctRate = Math.round((this.correctCount / this.answeredQuestions.filter(Boolean).length) * 100) || 0;
    },
    confirmExit() {
      // 如果有已答题但未完成的题目，显示确认弹窗
      if (this.answeredQuestions.some(Boolean) && !this.answeredQuestions.every(Boolean)) {
        this.showExitConfirm = true;
      } else {
        this.exitPractice();
      }
    },
    exitPractice() {
      uni.navigateBack();
    },
    retryPractice() {
      this.showResult = false;
      this.loadQuestions();
    },
    backToCategory() {
      this.showResult = false;
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
    getCorrectAnswer(index) {
      const question = this.questions[index];
      if (!question || !question.options) return '';
      
      for (const option of question.options) {
        if (option.isCorrect) {
          return question.type === 4 ? option.content : option.optionId;
        }
      }
      
      return '';
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #f8f8f8;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  padding: 30rpx;
  
  .back-btn {
    margin-right: 20rpx;
  }
  
  .title {
    flex: 1;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    text-align: center;
  }
  
  .progress {
    font-size: 28rpx;
    color: #666;
  }
}

.progress-bar {
  height: 8rpx;
  background-color: #eee;
  width: 100%;
  
  .progress-inner {
    height: 100%;
    background-color: #5b6af0;
    transition: width 0.3s;
  }
}

.question-swiper {
  flex: 1;
  height: calc(100vh - 200rpx);
}

.question-scroll {
  height: 100%;
  padding: 30rpx;
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

.action-buttons {
  display: flex;
  padding: 30rpx;
  
  .action-btn {
    flex: 1;
    height: 90rpx;
    border-radius: 45rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    font-weight: bold;
    margin: 0 10rpx;
    
    &.prev {
      background-color: #f5f5f5;
      color: #666;
    }
    
    &.submit {
      background-color: #5b6af0;
      color: #fff;
      box-shadow: 0 6rpx 16rpx rgba(91, 106, 240, 0.4);
    }
    
    &.next {
      background-color: #5b6af0;
      color: #fff;
      box-shadow: 0 6rpx 16rpx rgba(91, 106, 240, 0.4);
    }
    
    &.finish {
      background-color: #52c41a;
      color: #fff;
      box-shadow: 0 6rpx 16rpx rgba(82, 196, 26, 0.4);
    }
  }
}

.exit-popup {
  width: 600rpx;
  padding: 40rpx;
  
  .exit-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 30rpx;
  }
  
  .exit-content {
    font-size: 30rpx;
    color: #666;
    text-align: center;
    margin-bottom: 40rpx;
  }
  
  .exit-buttons {
    display: flex;
    border-top: 2rpx solid #eee;
    
    .exit-cancel, .exit-confirm {
      flex: 1;
      height: 100rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
    }
    
    .exit-cancel {
      color: #666;
      border-right: 2rpx solid #eee;
    }
    
    .exit-confirm {
      color: #f5222d;
      font-weight: bold;
    }
  }
}

.result-popup {
  width: 600rpx;
  padding: 40rpx;
  
  .result-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 30rpx;
  }
  
  .result-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40rpx;
    
    .result-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .result-value {
        font-size: 48rpx;
        font-weight: bold;
        color: #5b6af0;
        margin-bottom: 10rpx;
      }
      
      .result-label {
        font-size: 28rpx;
        color: #666;
      }
    }
  }
  
  .result-buttons {
    display: flex;
    
    .result-btn {
      flex: 1;
      height: 90rpx;
      border-radius: 45rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
      font-weight: bold;
      margin: 0 10rpx;
    }
    
    .result-btn.retry {
      background-color: #5b6af0;
      color: #fff;
      box-shadow: 0 6rpx 16rpx rgba(91, 106, 240, 0.4);
    }
    
    .result-btn.back {
      background-color: #f5f5f5;
      color: #666;
    }
  }
}
</style>
