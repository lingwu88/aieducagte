<template>
  <view class="container">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <u-icon name="arrow-left" color="#333" size="32"></u-icon>
      </view>
      <view class="title">{{ categoryName }}</view>
    </view>
    
    <view class="stats-card">
      <view class="stats-item">
        <text class="stats-value">{{ categoryInfo.questionCount || 0 }}</text>
        <text class="stats-label">总题数</text>
      </view>
      <view class="stats-item">
        <text class="stats-value">{{ categoryInfo.completedCount || 0 }}</text>
        <text class="stats-label">已完成</text>
      </view>
      <view class="stats-item">
        <text class="stats-value">{{ categoryInfo.accuracy || 0 }}%</text>
        <text class="stats-label">正确率</text>
      </view>
    </view>
    
    <view class="filter-bar">
      <view class="filter-label">难度：</view>
      <view class="filter-options">
        <view 
          class="filter-option" 
          :class="{ active: selectedDifficulty === 0 }"
          @click="setDifficulty(0)"
        >全部</view>
        <view 
          class="filter-option" 
          :class="{ active: selectedDifficulty === 1 }"
          @click="setDifficulty(1)"
        >简单</view>
        <view 
          class="filter-option" 
          :class="{ active: selectedDifficulty === 2 }"
          @click="setDifficulty(2)"
        >中等</view>
        <view 
          class="filter-option" 
          :class="{ active: selectedDifficulty === 3 }"
          @click="setDifficulty(3)"
        >困难</view>
      </view>
    </view>
    
    <view class="question-list">
      <view 
        class="question-item" 
        v-for="(question, index) in questions" 
        :key="question.questionId"
        @click="navigateToQuestion(question)"
      >
        <view class="question-index">{{ index + 1 }}</view>
        <view class="question-content">
          <view class="question-title">{{ question.content }}</view>
          <view class="question-meta">
            <view class="question-type">
              {{ getQuestionType(question.type) }}
            </view>
            <view class="question-difficulty">
              {{ getDifficultyLabel(question.difficulty) }}
            </view>
          </view>
        </view>
        <view class="question-status">
          <view v-if="question.isAnswered" class="status-icon" :class="{ correct: question.isCorrect, wrong: !question.isCorrect }">
            <u-icon :name="question.isCorrect ? 'checkmark-circle' : 'close-circle'" :color="question.isCorrect ? '#52c41a' : '#f5222d'" size="40"></u-icon>
          </view>
          <view v-else class="status-text">未答</view>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-if="questions.length === 0 && !loading">
      <image src="/static/questionBank/empty.png" mode="aspectFit"></image>
      <text>暂无题目</text>
    </view>
    
    <view class="loading-more" v-if="hasMore && !loading">
      <text @click="loadMore">加载更多</text>
    </view>
    
    <view class="practice-btn" @click="startPractice">
      开始练习
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
      categoryId: '',
      categoryName: '',
      categoryInfo: {},
      questions: [],
      selectedDifficulty: 0,
      loading: false,
      hasMore: true,
      lastQuestionId: '',
      pageSize: 10
    };
  },
  onLoad(options) {
    this.userId = uni.getStorageSync('userId');
    this.categoryId = options.categoryId;
    this.categoryName = decodeURIComponent(options.name || '分类详情');
    
    this.loadCategoryInfo();
    this.loadQuestions();
  },
  mounted() {
    this.checkUserId();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    loadCategoryInfo() {
      this.$api.questionBank.getCategoryById(this.userId, this.categoryId)
        .then(res => {
          if (res.code === 0) {
            this.categoryInfo = res.data || {};
          } else {
            uni.showToast({
              title: res.info || '获取分类信息失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取分类信息失败', err);
          uni.showToast({
            title: '获取分类信息失败，请稍后重试',
            icon: 'none'
          });
        });
    },
    loadQuestions(append = false) {
      if (this.loading) return;
      
      this.loading = true;
      if (!append) {
        uni.showLoading({ title: '加载中' });
      }
      
      const params = {
        userId: this.userId,
        categoryId: this.categoryId,
        limit: this.pageSize
      };
      
      if (this.selectedDifficulty > 0) {
        params.difficulty = this.selectedDifficulty;
      }
      
      if (append && this.lastQuestionId) {
        params.questionId = this.lastQuestionId;
      }
      
      this.$api.questionBank.getQuestionList(params)
        .then(res => {
          if (res.code === 0) {
            const newQuestions = res.data || [];
            
            if (append) {
              this.questions = [...this.questions, ...newQuestions];
            } else {
              this.questions = newQuestions;
            }
            
            if (newQuestions.length < this.pageSize) {
              this.hasMore = false;
            } else {
              this.hasMore = true;
              this.lastQuestionId = newQuestions[newQuestions.length - 1].questionId;
            }
          } else {
            uni.showToast({
              title: res.info || '获取题目列表失败',
              icon: 'none'
            });
          }
        })
        .catch(err => {
          console.error('获取题目列表失败', err);
          uni.showToast({
            title: '获取题目列表失败，请稍后重试',
            icon: 'none'
          });
        })
        .finally(() => {
          this.loading = false;
          uni.hideLoading();
        });
    },
    setDifficulty(difficulty) {
      if (this.selectedDifficulty === difficulty) return;
      
      this.selectedDifficulty = difficulty;
      this.hasMore = true;
      this.lastQuestionId = '';
      this.loadQuestions();
    },
    loadMore() {
      if (this.hasMore && !this.loading) {
        this.loadQuestions(true);
      }
    },
    navigateToQuestion(question) {
      uni.navigateTo({
        url: `/pages/questionBank/question?questionId=${question.questionId}`
      });
    },
    startPractice() {
      uni.navigateTo({
        url: `/pages/questionBank/practice?categoryId=${this.categoryId}`
      });
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

.stats-card {
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .stats-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    
    .stats-value {
      font-size: 48rpx;
      font-weight: bold;
      color: #5b6af0;
      margin-bottom: 10rpx;
    }
    
    .stats-label {
      font-size: 28rpx;
      color: #666;
    }
  }
}

.filter-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .filter-label {
    font-size: 28rpx;
    color: #333;
    margin-right: 20rpx;
  }
  
  .filter-options {
    display: flex;
    flex: 1;
    
    .filter-option {
      padding: 10rpx 20rpx;
      font-size: 26rpx;
      color: #666;
      border-radius: 8rpx;
      margin-right: 15rpx;
      
      &.active {
        background-color: #5b6af0;
        color: #fff;
      }
    }
  }
}

.question-list {
  margin-bottom: 30rpx;
  
  .question-item {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    
    .question-index {
      width: 60rpx;
      height: 60rpx;
      border-radius: 30rpx;
      background-color: #f0f2ff;
      color: #5b6af0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28rpx;
      font-weight: bold;
      margin-right: 20rpx;
    }
    
    .question-content {
      flex: 1;
      
      .question-title {
        font-size: 30rpx;
        color: #333;
        margin-bottom: 15rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      
      .question-meta {
        display: flex;
        align-items: center;
        
        .question-type, .question-difficulty {
          font-size: 24rpx;
          color: #999;
          background-color: #f5f5f5;
          padding: 6rpx 16rpx;
          border-radius: 6rpx;
          margin-right: 15rpx;
        }
      }
    }
    
    .question-status {
      margin-left: 20rpx;
      
      .status-icon {
        &.correct {
          color: #52c41a;
        }
        
        &.wrong {
          color: #f5222d;
        }
      }
      
      .status-text {
        font-size: 26rpx;
        color: #999;
      }
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  
  image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
  }
  
  text {
    font-size: 30rpx;
    color: #999;
  }
}

.loading-more {
  text-align: center;
  padding: 30rpx 0;
  
  text {
    font-size: 28rpx;
    color: #5b6af0;
  }
}

.practice-btn {
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
}
</style>
