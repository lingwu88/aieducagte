<template>
  <view class="content-preference">
    <!-- 顶部标题区域 -->
    <view class="header">
      <view class="back-button" @tap="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="title-container">
        <text class="title">内容偏好</text>
        <text class="subtitle">了解您喜欢的学习内容类型</text>
      </view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content-scroll" scroll-y>
      <view class="report-container">
        <!-- 主标题 -->
        <view class="report-header">
          <text class="report-title">内容偏好分析报告</text>
          <view class="report-date">
            <text>生成日期: {{ formattedDate }}</text>
          </view>
        </view>

        <!-- 分析内容区域 -->
        <view class="report-content">
          <!-- 学习领域与兴趣方向 -->
          <view class="section">
            <view class="section-header" style="background: linear-gradient(to right, rgba(91, 106, 240, 0.1), rgba(123, 137, 255, 0.05));">
              <view class="header-left-border" style="background: linear-gradient(to bottom, #5b6af0, #7b89ff);"></view>
              <text class="section-title">学习领域与兴趣方向</text>
            </view>
            <view class="section-content">
              <view class="point">
                <view class="point-bullet"></view>
                <text class="point-text">您对&quot;计算机科学&quot;和&quot;Rust语言&quot;表现出浓厚兴趣，这表明您正在向编程和技术开发领域转型。建议深入学习Rust生态系统中的实际项目开发，同时探索相关后端框架（如Actix或Tokio）以增强实战能力。</text>
              </view>
              <view class="point">
                <view class="point-bullet"></view>
                <text class="point-text">您关注&quot;概率论&quot;和&quot;高等数学&quot;，这可能是为考研数学做准备。建议结合目标院校广东工业大学的考研大纲，针对性练习高数中的微积分和线性代数部分，同时强化概率统计的应用题训练。</text>
              </view>
            </view>
          </view>

          <!-- 学习习惯与效率提升 -->
          <view class="section">
            <view class="section-header" style="background: linear-gradient(to right, rgba(255, 107, 107, 0.1), rgba(255, 159, 159, 0.05));">
              <view class="header-left-border" style="background: linear-gradient(to bottom, #ff6b6b, #ff9f9f);"></view>
              <text class="section-title">学习习惯与效率提升</text>
            </view>
            <view class="section-content">
              <view class="point">
                <view class="point-bullet"></view>
                <text class="point-text">您目前的学习领域跨度较大（从机械到计算机科学），说明您具备较强的学习动力和适应能力。但需注意合理分配时间，避免多线程学习导致精力分散。建议每天固定时间段专注某一领域，例如上午主攻数学，下午学习编程。</text>
              </view>
              <view class="point">
                <view class="point-bullet"></view>
                <text class="point-text">如果尚未尝试过时间管理工具，可以引入番茄钟法（25分钟专注+5分钟休息）来提高学习效率，特别是在晚间学习时保持专注。</text>
              </view>
            </view>
          </view>

          <!-- 薄弱点与改进建议 -->
          <view class="section">
            <view class="section-header" style="background: linear-gradient(to right, rgba(78, 205, 196, 0.1), rgba(126, 232, 223, 0.05));">
              <view class="header-left-border" style="background: linear-gradient(to bottom, #4ecdc4, #7ee8df);"></view>
              <text class="section-title">薄弱点与改进建议</text>
            </view>
            <view class="section-content">
              <view class="point">
                <view class="point-bullet"></view>
                <text class="point-text">作为机械专业的学生，转码需要补充计算机基础理论知识（如数据结构、算法）。建议从经典教材《算法导论》入手，并通过LeetCode等平台进行实践训练。</text>
              </view>
              <view class="point">
                <view class="point-bullet"></view>
                <text class="point-text">考研数学是您的重点任务之一，尤其在概率论中可能存在的薄弱环节（如随机变量分布），可以通过专项刷题和观看B站优质课程弥补不足。</text>
              </view>
            </view>
          </view>

          <!-- 目标导向与路径规划 -->
          <view class="section">
            <view class="section-header" style="background: linear-gradient(to right, rgba(255, 209, 102, 0.1), rgba(255, 229, 157, 0.05));">
              <view class="header-left-border" style="background: linear-gradient(to bottom, #ffd166, #ffe59d);"></view>
              <text class="section-title">目标导向与路径规划</text>
            </view>
            <view class="section-content">
              <view class="point">
                <view class="point-bullet"></view>
                <text class="point-text">您明确提到目标院校为广东工业大学，且有考研计划。建议尽早获取该校机械专业和计算机相关专业的历年真题，了解考试侧重点。同时，关注复试中可能涉及的编程能力考核。</text>
              </view>
              <view class="point">
                <view class="point-bullet"></view>
                <text class="point-text">转码目标表明您希望未来从事技术类工作。除了学习Rust外，可以适当拓展其他主流语言（如Python或C++），以增加就业竞争力。</text>
              </view>
            </view>
          </view>

          <!-- 综合发展建议 -->
          <view class="section">
            <view class="section-header" style="background: linear-gradient(to right, rgba(108, 92, 231, 0.1), rgba(162, 155, 254, 0.05));">
              <view class="header-left-border" style="background: linear-gradient(to bottom, #6c5ce7, #a29bfe);"></view>
              <text class="section-title">综合发展建议</text>
            </view>
            <view class="section-content">
              <view class="point">
                <view class="point-bullet"></view>
                <text class="point-text">在东莞理工学院期间，可充分利用学校资源（如实验室、图书馆）提升自己的学术背景，同时积极参与开源项目或线上竞赛（如Kaggle、Hackathon），积累实践经验。</text>
              </view>
              <view class="point">
                <view class="point-bullet"></view>
                <text class="point-text">针对跨专业考研，提前联系广东工业大学的学长学姐，获取备考经验和导师研究方向信息，有助于更精准地制定复习策略。</text>
              </view>
            </view>
          </view>

          <!-- 总结 -->
          <view class="summary-section">
            <view class="summary-header">
              <text class="summary-title">总结</text>
            </view>
            <view class="summary-content">
              <text class="summary-text">当前阶段应聚焦于夯实数学基础、深化编程技能，同时兼顾考研与转码的双重目标，逐步构建扎实的知识体系与实践能力。</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formattedDate: this.getCurrentDate(),
      reportData: null
    };
  },
  onLoad() {
    // 模拟从API获取数据
    this.fetchPreferenceData();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    
    getCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    
    // 获取内容偏好数据
    fetchPreferenceData() {
      // 这里应该是从API获取数据
      // 示例代码：
      // uni.request({
      //   url: 'https://api.example.com/content-preference',
      //   method: 'GET',
      //   success: (res) => {
      //     if (res.statusCode === 200) {
      //       this.reportData = this.parseMarkdown(res.data.result);
      //     }
      //   },
      //   fail: (err) => {
      //     console.error('获取内容偏好数据失败', err);
      //   }
      // });
      
      // 使用模拟数据
      setTimeout(() => {
        const mockData = {
          result: "### 内容偏好分析报告\n\n" +
            "1. **学习领域与兴趣方向**  \n" +
            "   - 您对&quot;计算机科学&quot;和&quot;Rust语言&quot;表现出浓厚兴趣，这表明您正在向编程和技术开发领域转型。建议深入学习Rust生态系统中的实际项目开发，同时探索相关后端框架（如Actix或Tokio）以增强实战能力。  \n" +
            "   - 您关注&quot;概率论&quot;和&quot;高等数学&quot;，这可能是为考研数学做准备。建议结合目标院校广东工业大学的考研大纲，针对性练习高数中的微积分和线性代数部分，同时强化概率统计的应用题训练。\n\n" +
            "2. **学习习惯与效率提升**  \n" +
            "   - 您目前的学习领域跨度较大（从机械到计算机科学），说明您具备较强的学习动力和适应能力。但需注意合理分配时间，避免多线程学习导致精力分散。建议每天固定时间段专注某一领域，例如上午主攻数学，下午学习编程。  \n" +
            "   - 如果尚未尝试过时间管理工具，可以引入番茄钟法（25分钟专注+5分钟休息）来提高学习效率，特别是在晚间学习时保持专注。\n\n" +
            "3. **薄弱点与改进建议**  \n" +
            "   - 作为机械专业的学生，转码需要补充计算机基础理论知识（如数据结构、算法）。建议从经典教材《算法导论》入手，并通过LeetCode等平台进行实践训练。  \n" +
            "   - 考研数学是您的重点任务之一，尤其在概率论中可能存在的薄弱环节（如随机变量分布），可以通过专项刷题和观看B站优质课程弥补不足。\n\n" +
            "4. **目标导向与路径规划**  \n" +
            "   - 您明确提到目标院校为广东工业大学，且有考研计划。建议尽早获取该校机械专业和计算机相关专业的历年真题，了解考试侧重点。同时，关注复试中可能涉及的编程能力考核。  \n" +
            "   - 转码目标表明您希望未来从事技术类工作。除了学习Rust外，可以适当拓展其他主流语言（如Python或C++），以增加就业竞争力。  \n\n" +
            "5. **综合发展建议**  \n" +
            "   - 在东莞理工学院期间，可充分利用学校资源（如实验室、图书馆）提升自己的学术背景，同时积极参与开源项目或线上竞赛（如Kaggle、Hackathon），积累实践经验。  \n" +
            "   - 针对跨专业考研，提前联系广东工业大学的学长学姐，获取备考经验和导师研究方向信息，有助于更精准地制定复习策略。  \n\n" +
            "总结：当前阶段应聚焦于夯实数学基础、深化编程技能，同时兼顾考研与转码的双重目标，逐步构建扎实的知识体系与实践能力。"
        };
        
        this.reportData = this.parseMarkdown(mockData.result);
      }, 500);
    },
    
    // 解析Markdown格式的数据（实际项目中可以使用专门的Markdown解析库）
    parseMarkdown(markdownText) {
      // 这里是简单的解析逻辑，实际项目中可以使用更完善的Markdown解析库
      const sections = [];
      
      // 提取标题
      const titleMatch = markdownText.match(/###\s+(.*)/);
      const title = titleMatch ? titleMatch[1].trim() : '内容偏好分析报告';
      
      // 提取各个部分
      const sectionRegex = /\d+\.\s+\*\*(.*?)\*\*\s+([\s\S]*?)(?=\d+\.\s+\*\*|总结：|$)/g;
      let match;
      
      while ((match = sectionRegex.exec(markdownText)) !== null) {
        const sectionTitle = match[1].trim();
        const sectionContent = match[2].trim();
        
        // 提取每个部分中的要点
        const points = [];
        const pointRegex = /-\s+(.*?)(?=-\s+|$)/g;
        let pointMatch;
        
        while ((pointMatch = pointRegex.exec(sectionContent)) !== null) {
          points.push(pointMatch[1].trim());
        }
        
        sections.push({
          title: sectionTitle,
          points: points
        });
      }
      
      // 提取总结
      const summaryMatch = markdownText.match(/总结：(.*?)$/);
      const summary = summaryMatch ? summaryMatch[1].trim() : '';
      
      return {
        title,
        sections,
        summary
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.content-preference {
  min-height: 100vh;
  background-color: #f8f9fd;
  display: flex;
  flex-direction: column;
}

.header {
  background: linear-gradient(to right, #5b6af0, #7b89ff);
  padding: 60rpx 30rpx 40rpx;
  color: #fff;
  position: relative;
  box-shadow: 0 4rpx 20rpx rgba(91, 106, 240, 0.3);
  display: flex;
  align-items: center;
}

.back-button {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-right: 20rpx;
}

.back-icon {
  font-size: 36rpx;
  color: #fff;
}

.title-container {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 26rpx;
  opacity: 0.85;
}

.content-scroll {
  flex: 1;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
}

.report-container {
  padding: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  margin: 20rpx;
  box-sizing: border-box;
  width: auto;
}

.report-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;
}

.report-header:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 30rpx;
  right: 30rpx;
  height: 2rpx;
  background: linear-gradient(to right, #5b6af0, #7b89ff, transparent);
}

.report-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  position: relative;
  display: inline-block;
}

.report-title:after {
  content: "";
  position: absolute;
  bottom: -8rpx;
  left: 0;
  width: 60rpx;
  height: 4rpx;
  background: linear-gradient(to right, #5b6af0, #7b89ff);
  border-radius: 2rpx;
}

.report-date {
  font-size: 24rpx;
  color: #999;
}

.report-content {
  padding: 20rpx;
}

.section {
  margin-bottom: 40rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.03);
  background-color: #fff;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx;
  position: relative;
  border-radius: 12rpx 12rpx 0 0;
}

.header-left-border {
  width: 8rpx;
  height: 36rpx;
  border-radius: 4rpx;
  margin-right: 16rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-content {
  padding: 24rpx 30rpx;
  background-color: #fff;
  border-radius: 0 0 12rpx 12rpx;
}

.point {
  display: flex;
  margin-bottom: 24rpx;
  position: relative;
}

.point-bullet {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: #5b6af0;
  margin-top: 14rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
  box-shadow: 0 0 6rpx rgba(91, 106, 240, 0.4);
}

.point-text {
  font-size: 28rpx;
  color: #555;
  line-height: 1.6;
  word-wrap: break-word;
  word-break: break-all;
  flex: 1;
}

.summary-section {
  margin-top: 30rpx;
  padding: 30rpx;
  background: linear-gradient(to right, rgba(91, 106, 240, 0.1), rgba(123, 137, 255, 0.1));
  border-radius: 16rpx;
}

.summary-header {
  margin-bottom: 20rpx;
}

.summary-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #5b6af0;
}

.summary-text {
  font-size: 28rpx;
  color: #555;
  line-height: 1.6;
}
</style>