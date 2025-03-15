<template>
  <view class="strengths-weaknesses">
    <!-- 头部区域 -->
    <view class="header">
      <text class="title">您的学习优势与劣势</text>
      <text class="subtitle">了解您的学习特点，优化学习策略。</text>
    </view>

    <!-- 内容区域 -->
    <view class="content">
      <!-- 优势部分 -->
      <view class="section">
        <text class="section-title">优势</text>
        <view
          v-for="(item, index) in strengths"
          :key="index"
          class="card"
          @tap="toggleAccordion(index, 'strengths')"
        >
          <view class="card-header">
            <text class="card-title">{{ item.title }}</text>
            <text class="card-icon">{{ item.expanded ? '▲' : '▼' }}</text>
          </view>
          <view class="card-content" v-if="item.expanded">
            <text class="card-description">{{ item.description }}</text>
            <view class="suggestions">
              <text class="suggestion-title">建议：</text>
              <text
                v-for="(suggestion, sIndex) in item.suggestions"
                :key="sIndex"
                class="suggestion-item"
              >
                {{ suggestion }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- 劣势部分 -->
      <view class="section">
        <text class="section-title">劣势</text>
        <view
          v-for="(item, index) in weaknesses"
          :key="index"
          class="card"
          @tap="toggleAccordion(index, 'weaknesses')"
        >
          <view class="card-header">
            <text class="card-title">{{ item.title }}</text>
            <text class="card-icon">{{ item.expanded ? '▲' : '▼' }}</text>
          </view>
          <view class="card-content" v-if="item.expanded">
            <text class="card-description">{{ item.description }}</text>
            <view class="suggestions">
              <text class="suggestion-title">建议：</text>
              <text
                v-for="(suggestion, sIndex) in item.suggestions"
                :key="sIndex"
                class="suggestion-item"
              >
                {{ suggestion }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部区域 -->
    <view class="footer">
      <text class="footer-text">© 2025 学习助手 | 当前日期：{{ currentDate }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      strengths: [],
      weaknesses: [],
      currentDate: ''
    };
  },
  onLoad() {
    // 设置当前日期
    const date = new Date();
    this.currentDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    // 初始化静态数据（未来可替换为 API 调用）
    this.strengths = [
      {
        title: '跨学科优势',
        description:
          '您目前的专业是“机械”，但学习领域涉及“计算机科学”、“Rust”等编程相关内容。这种跨学科背景为您提供了独特的竞争力，尤其是在工业4.0、智能制造、机器人等领域，这些行业需要既懂机械又懂编程的复合型人才。',
        suggestions: [
          '在考研复习中，可以结合机械与计算机的知识点（如嵌入式系统、自动化控制），展现您对交叉学科的理解。'
        ],
        expanded: false
      },
      {
        title: '扎实的数学基础',
        description:
          '您提到的学习领域包括“概率论”和“高等数学”，这是计算机科学（尤其是人工智能、机器学习方向）的重要基础。扎实的数学能力将帮助您更轻松地理解算法原理和优化方法。',
        suggestions: [
          '针对考研中的数学部分，您可以利用已有的知识体系进行强化训练，特别是线性代数和概率统计相关的题目。'
        ],
        expanded: false
      },
      {
        title: '明确的目标驱动',
        description:
          '您已经明确了目标院校（广东工业大学计算机专业）和目标（考研）。这种清晰的方向感有助于制定长期计划并保持动力。',
        suggestions: [
          '将大目标拆解为阶段性小目标，例如每月完成一个核心科目的复习，并定期评估进度。'
        ],
        expanded: false
      },
      {
        title: '新兴技术兴趣（Rust语言）',
        description:
          'Rust作为一种高效且安全的编程语言，在系统开发、区块链、嵌入式等领域有广泛应用。您选择学习Rust表明您对前沿技术感兴趣，这不仅有助于提升个人技能，还可能成为未来求职或研究的亮点。',
        suggestions: [
          '尝试用Rust实现一些小型项目（如数据结构练习或算法实现），以增强实践能力，同时为研究生阶段的研究积累经验。'
        ],
        expanded: false
      },
      {
        title: '良好的学习习惯',
        description:
          '您的学习领域涵盖了多个难度较高的学科（如计算机科学、高等数学），说明您具备较强的学习能力和自律性。',
        suggestions: [
          '继续保持规律的学习节奏，同时探索适合自己的高效学习方法，例如使用费曼技巧讲解复杂概念，或者通过刷题平台（如Leetcode）提高编程水平。'
        ],
        expanded: false
      }
    ];

    this.weaknesses = [
      {
        title: '跨领域学习挑战',
        description:
          '您的学习领域涉及“计算机科学”和“Rust”，但您的本科专业是“机械”。这表明您正在尝试跨领域学习，可能会面临基础知识不足的问题（如数据结构、算法等计算机科学核心概念）。',
        suggestions: [
          '系统性补充计算机科学的基础知识，例如通过在线课程（如Coursera、edX）或教材（如《算法导论》）。'
        ],
        expanded: false
      },
      {
        title: '数学与编程结合能力',
        description:
          '您提到学习“概率论 中心极限定理”和“高等数学下 高斯定理”，这些内容在机器学习、数据分析等领域非常重要。然而，如何将数学理论应用到编程实践中可能是您的薄弱点。',
        suggestions: [
          '尝试完成一些结合数学与编程的小项目，例如用Python实现中心极限定理的模拟，或用Rust编写数值计算程序。'
        ],
        expanded: false
      },
      {
        title: '考研目标与时间管理',
        description:
          '您的目标是考研到“广东工业大学”，但目前的学习领域较为分散（计算机科学、数学、机械）。如果不能有效聚焦于考研科目（如数学、英语、专业课），可能会影响备考效率。',
        suggestions: [
          '制定明确的学习计划，优先复习考研相关科目，并定期评估进度。'
        ],
        expanded: false
      },
      {
        title: '实践与理论平衡',
        description:
          '您对“Rust”表现出兴趣，但Rust是一门注重实践的编程语言。如果仅停留在理论学习而缺乏实际项目经验，可能难以深入掌握其特性（如内存安全、并发处理）。',
        suggestions: [
          '参与开源项目或自己动手开发小工具，积累实践经验。'
        ],
        expanded: false
      },
      {
        title: '机械专业背景的利用',
        description:
          '您的本科专业是“机械”，但在学习领域中并未体现与机械相关的深度学习方向（如机器人学、控制工程）。如果您希望未来从事跨学科研究，可能需要进一步挖掘机械专业的优势。',
        suggestions: [
          '探索机械与计算机科学的交叉领域，例如智能制造、工业自动化等。'
        ],
        expanded: false
      }
    ];
  },
  methods: {
    toggleAccordion(index, type) {
      const items = type === 'strengths' ? this.strengths : this.weaknesses;
      items[index].expanded = !items[index].expanded;
      this.$forceUpdate(); // 强制更新视图
    }
  }
};
</script>

<style lang="scss" scoped>
.strengths-weaknesses {
  padding: 20rpx;
  font-family: 'PingFang SC', sans-serif;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.header {
  margin-bottom: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  font-size: 42rpx;
  font-weight: bold;
  color: #4c6ef5;
}
.subtitle {
  font-size: 28rpx;
  color: #666666;
  margin-top: 10rpx;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 40rpx;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.section-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}
.card:hover {
  transform: scale(1.02);
  box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.1);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.card-icon {
  font-size: 28rpx;
  color: #666;
}
.card-content {
  margin-top: 20rpx;
  animation: slideIn 0.3s ease-in-out;
}
.card-description {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}
.suggestions {
  margin-top: 20rpx;
}
.suggestion-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #4c6ef5;
}
.suggestion-item {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin-top: 10rpx;
  display: block;
}

.footer {
  margin-top: 40rpx;
  text-align: center;
}
.footer-text {
  font-size: 24rpx;
  color: #999;
}

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>