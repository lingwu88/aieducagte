<template>
  <scroll-view class="learn-suggestions" scroll-y>
    <!-- 学习导航仪 -->
    <view class="navigation-header">
      <view class="header-title">
        <text class="title-text">学习导航仪</text>
        <text class="subtitle">您的考研与未来发展蓝图</text>
      </view>
      <view class="progress-panel">
        <view class="progress-ring">
          <text class="progress-value">{{ overallProgress }}%</text>
        </view>
        <view class="progress-info">
          <text class="target">目标: 广东工业大学</text>
          <text class="timeline">2025考研倒计时: {{ countdownDays }}天</text>
        </view>
      </view>
    </view>

    <!-- 建议星图 -->
    <view class="suggestion-starfield">
      <view
        v-for="(item, index) in suggestions"
        :key="index"
        class="suggestion-card"
        @tap="toggleCard(index)"
        @longpress="showResources(index)"
      >
        <view class="card-header">
          <text class="card-title">{{ item.title }}</text>
          <text class="card-icon">{{ item.expanded ? '▲' : '▼' }}</text>
        </view>
        <view class="card-content" v-if="item.expanded">
          <text class="card-description">{{ item.description }}</text>
          <view class="action-steps">
            <text class="action-title">行动建议</text>
            <text
              v-for="(step, sIndex) in item.steps"
              :key="sIndex"
              class="action-step"
            >
              {{ sIndex + 1 }}. {{ step }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      overallProgress: 70, // 示例总体进度
      countdownDays: 0, // 考研倒计时
      suggestions: [
        {
          title: "考研目标与学习领域结合",
          description:
            "您的目标是考取广东工业大学研究生，同时对计算机科学和Rust语言有浓厚兴趣。这种跨学科兴趣将为您未来的研究方向（如机械智能化、自动化控制）奠定基础。",
          steps: [
            "备考期间，分配时间深入学习编程和数学，增强逻辑思维能力。",
            "重点复习‘高等数学’和‘概率论’（如中心极限定理、高斯定理），结合历年考研真题练习。"
          ],
          expanded: false
        },
        {
          title: "明确考研关注点",
          description:
            "您关注‘分数线’和‘面试信息’，建议通过多种渠道获取最新资讯，确保备考有的放矢。",
          steps: [
            "定期查阅广东工业大学研究生院官网，了解招生简章和往年分数线。",
            "加入考研交流群，向学长学姐咨询面试经验，提前准备专业问题（机械基础+计算机自学成果）。"
          ],
          expanded: false
        },
        {
          title: "优化学习计划",
          description:
            "您的学习领域跨度较大（机械到计算机科学），需要科学规划时间以提高效率。",
          steps: [
            "每天固定时间学习核心科目（如数学和专业课），搭配番茄工作法。",
            "针对Rust和计算机科学，尝试完成小型项目（如算法实现或工具开发）巩固理论。"
          ],
          expanded: false
        },
        {
          title: "补充薄弱点",
          description:
            "在概率论或高等数学等薄弱领域，建议系统性补充知识，Rust语言也需深入学习。",
          steps: [
            "参考在线课程（如B站、Coursera）或考研辅导书学习概率论和高数。",
            "从Rust官方文档入手，逐步掌握内存管理和并发模型。"
          ],
          expanded: false
        },
        {
          title: "长期发展建议",
          description:
            "考研成功后，建议结合机械与计算机科学，探索交叉领域，发挥多学科优势。",
          steps: [
            "关注智能制造、机器人控制等方向，符合行业趋势。",
            "研究生阶段可尝试相关项目，积累实践经验。"
          ],
          expanded: false
        }
      ]
    };
  },

  onLoad() {
    this.calculateCountdown();
    this.animateEntry();
  },

  methods: {
    calculateCountdown() {
      const targetDate = new Date("2025-06-30"); // 假设考研日期
      const today = new Date();
      const diffTime = targetDate - today;
      this.countdownDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    toggleCard(index) {
      this.suggestions[index].expanded = !this.suggestions[index].expanded;
      this.$forceUpdate();
    },

    showResources(index) {
      const resources = {
        0: "考研数学真题",
        1: "广东工业大学官网",
        2: "Rust项目示例",
        3: "B站概率论课程",
        4: "智能制造论文"
      };
      uni.showToast({
        title: `资源提示: ${resources[index] || "暂无资源"}`,
        icon: "none"
      });
    },

    animateEntry() {
      this.suggestions.forEach((item, index) => {
        setTimeout(() => {
          item.expanded = false; // 初始折叠
        }, index * 200); // 星光闪烁入场
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// 设计 Token 系统
:root {
  --space-unit: 8rpx;
  --color-primary: hsl(210, 80%, 55%);
  --color-accent: hsl(160, 90%, 45%);
  --motion-easing: cubic-bezier(0.4, 0, 0.2, 1);
}

.learn-suggestions {
  min-height: 100vh;
  background: linear-gradient(145deg, #1A2533 0%, #2E3B4E 100%);
  padding: calc(var(--space-unit) * 2);
}

/* 学习导航仪 */
.navigation-header {
  margin: 0 calc(var(--space-unit) * 4) calc(var(--space-unit) * 4);
  padding: calc(var(--space-unit) * 4);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);

  .header-title {
    margin-bottom: calc(var(--space-unit) * 2);

    .title-text {
      font-size: 48rpx;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.4);
    }

    .subtitle {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.7);
      margin-top: calc(var(--space-unit));
    }
  }

  .progress-panel {
    display: flex;
    align-items: center;

    .progress-ring {
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
      background: conic-gradient(var(--color-primary) 0% 70%, rgba(255, 255, 255, 0.2) 70% 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-right: calc(var(--space-unit) * 3);

      .progress-value {
        font-size: 36rpx;
        color: #fff;
        font-weight: bold;
      }

      &::after {
        content: '';
        position: absolute;
        width: 120rpx;
        height: 120rpx;
        background: #2E3B4E;
        border-radius: 50%;
      }
    }

    .progress-info {
      color: #fff;

      .target {
        font-size: 30rpx;
        font-weight: bold;
      }

      .timeline {
        font-size: 26rpx;
        color: rgba(255, 255, 255, 0.8);
        margin-top: calc(var(--space-unit));
      }
    }
  }
}

/* 建议星图 */
.suggestion-starfield {
  margin: 0 calc(var(--space-unit) * 4);

  .suggestion-card {
    background: rgba(255, 255, 255, 0.08);
    border: 1rpx solid rgba(255, 255, 255, 0.1);
    border-radius: 20rpx;
    padding: calc(var(--space-unit) * 3);
    margin-bottom: calc(var(--space-unit) * 2);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.15);
    transition: all 0.3s var(--motion-easing);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
      animation: lightFlow 3s infinite;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: scale(1.02);
      box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.25);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-title {
        font-size: 34rpx;
        font-weight: bold;
        color: #fff;
      }

      .card-icon {
        font-size: 28rpx;
        color: var(--color-accent);
      }
    }

    .card-content {
      margin-top: calc(var(--space-unit) * 2);
      animation: expand 0.3s var(--motion-easing);

      .card-description {
        font-size: 28rpx;
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
      }

      .action-steps {
        margin-top: calc(var(--space-unit) * 2);

        .action-title {
          font-size: 30rpx;
          font-weight: bold;
          color: var(--color-accent);
          display: block;
          margin-bottom: calc(var(--space-unit));
        }

        .action-step {
          font-size: 26rpx;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.6;
          margin-bottom: calc(var(--space-unit));
          display: block;
        }
      }
    }
  }
}

/* 动画效果 */
@keyframes expand {
  from {
    opacity: 0;
    transform: translateY(10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes lightFlow {
  0% { left: -100%; }
  50% { left: 100%; }
  100% { left: 100%; }
}
</style>