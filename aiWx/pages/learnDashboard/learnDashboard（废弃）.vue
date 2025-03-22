<!-- /pages/learnSuggestion/learnSuggestion.vue -->
<template>
  <view class="learn-suggestion">
    <!-- 报告头部 -->
    <view class="report-header">
      <view class="report-title">
        <text class="title-text">学习风格报告</text>
        <text class="subtitle">基于您的学习行为数据智能分析</text>
      </view>
      
      <view class="user-profile">
        <view class="avatar">
          <text class="avatar-text">{{ getUserInitial() }}</text>
        </view>
        <view class="user-info">
          <text class="user-name">{{ userName }}</text>
          <text class="report-date">{{ formatDate(reportDate) }}</text>
        </view>
      </view>
    </view>
    
    <!-- 学习词云展示区域 -->
    <view class="cloud-container">
      <view class="cloud-wrapper">
        <!-- 主标语 -->
        <view class="cloud-headline">
          <text class="headline-text">2025年，您的学习特质是</text>
          <text class="headline-tag">{{ mainTrait }}</text>
        </view>
        
        <!-- 词云动态区域 -->
        <view class="cloud-canvas-container">
          <canvas canvas-id="wordCloudCanvas" class="word-cloud-canvas"></canvas>
          <canvas canvas-id="particleCanvas" class="particle-canvas"></canvas>
        </view>
        
        <!-- 词云说明 -->
        <view class="cloud-desc">
          <text class="desc-title">您在学习方面的关键词</text>
          <text class="desc-subtitle">词的大小表示其在您的学习风格中的重要性</text>
        </view>
        
        <!-- 关键词展示区域 -->
        <view class="key-traits">
          <view 
            class="trait-tag" 
            v-for="(trait, index) in topTraits" 
            :key="index"
            :style="{ backgroundColor: trait.color }"
            @tap="showTraitDetail(trait)"
          >
            <text class="trait-text">{{ trait.text }}</text>
            <text class="trait-value">{{ trait.value }}%</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 玫瑰图区域 -->
    <view class="card tendency-section">
      <view class="card-header">
        <text class="card-title">学习能力分析</text>
        <text class="card-subtitle">相比平均水平，您的学习能力分布</text>
      </view>
      
      <view class="rose-chart-container">
        <canvas canvas-id="roseChartCanvas" class="rose-chart"></canvas>
      </view>
      
      <view class="axis-indicator" v-if="selectedAxis">
        <view class="indicator-color" :style="{ backgroundColor: selectedAxisColor }"></view>
        <view class="indicator-info">
          <text class="indicator-name">{{ selectedAxis.name }}</text>
          <text class="indicator-value">{{ selectedAxis.value }}%</text>
        </view>
        <view class="indicator-bar">
          <view class="indicator-fill" :style="{ width: selectedAxis.value + '%', backgroundColor: selectedAxisColor }"></view>
        </view>
        <text class="indicator-desc">{{ selectedAxis.description }}</text>
      </view>
    </view>
    
    <!-- 跳转卡片区域 -->
    <view class="navigation-section">
      <view class="card-heading">
        <text class="heading-title">探索您的学习之旅</text>
        <text class="heading-subtitle">基于分析结果为您定制的学习指南</text>
      </view>
      
      <view class="nav-cards">
        <view class="nav-card" @tap="navigateToFeedback('contentPreference')">
          <view class="card-icon" style="background-color: #FF6B6B;">
            <text class="iconfont icon-preference"></text>
          </view>
          <view class="card-content">
            <text class="card-title">内容偏好</text>
            <text class="card-desc">了解最适合您的学习内容类型</text>
          </view>
          <view class="card-action">
            <text class="action-text">查看</text>
            <text class="iconfont icon-arrow"></text>
          </view>
        </view>
        
        <view class="nav-card" @tap="navigateToFeedback('strengthsWeaknesses')">
          <view class="card-icon" style="background-color: #4ECDC4;">
            <text class="iconfont icon-analysis"></text>
          </view>
          <view class="card-content">
            <text class="card-title">优缺点分析</text>
            <text class="card-desc">发掘您的学习优势与提升空间</text>
          </view>
          <view class="card-action">
            <text class="action-text">查看</text>
            <text class="iconfont icon-arrow"></text>
          </view>
        </view>
        
        <view class="nav-card" @tap="navigateToFeedback('learningSuggestions')">
          <view class="card-icon" style="background-color: #FFD166;">
            <text class="iconfont icon-suggestion"></text>
          </view>
          <view class="card-content">
            <text class="card-title">学习建议</text>
            <text class="card-desc">个性化学习方法与策略推荐</text>
          </view>
          <view class="card-action">
            <text class="action-text">查看</text>
            <text class="iconfont icon-arrow"></text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 学习风格分享卡片 -->
    <view class="share-card">
      <view class="share-content">
        <text class="share-title">分享我的学习风格</text>
        <text class="share-desc">与朋友分享您的学习特质，了解彼此的学习风格</text>
      </view>
      <button class="share-button" @tap="shareReport">
        <text class="iconfont icon-share"></text>
        <text class="button-text">分享</text>
      </button>
    </view>
    
    <!-- 特质详情弹窗 -->
    <view class="trait-modal" v-if="showModal" @tap="closeModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">{{ modalTrait.text }}</text>
          <text class="modal-close iconfont" @tap="closeModal"></text>
        </view>
        <view class="modal-body">
          <view class="trait-score">
            <text class="score-value">{{ modalTrait.value }}%</text>
            <text class="score-label">您的特质强度</text>
          </view>
          <view class="trait-description">
            <text class="description-title">这意味着什么？</text>
            <text class="description-content">{{ modalTrait.description }}</text>
          </view>
          <view class="trait-tips">
            <text class="tips-title">如何充分利用这一特质</text>
            <view class="tips-list">
              <view class="tip-item" v-for="(tip, index) in modalTrait.tips" :key="index">
                <text class="tip-bullet">•</text>
                <text class="tip-text">{{ tip }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userName: "张同学",
      reportDate: new Date(),
      mainTrait: "视觉学习者",
      selectedAxis: null,
      selectedAxisColor: "",
      showModal: false,
      modalTrait: {},
      canvasWidth: 300, // 默认宽度，稍后通过查询动态设置
      canvasHeight: 250, // 默认高度，稍后通过查询动态设置
      
      // 词云数据
      wordCloudData: [
        { 
          text: "视觉学习", value: 90, color: "#FF6B6B",
          description: "您是一个出色的视觉学习者，通过图像、视频和可视化内容学习效果最佳。",
          tips: ["学习时使用思维导图和图表来组织信息", "观看教学视频来补充文字资料", "在笔记中使用颜色标记和图标增强记忆"]
        },
        { 
          text: "阅读理解", value: 85, color: "#4ECDC4",
          description: "您有很强的阅读理解能力，能够从文本材料中有效提取和吸收信息。",
          tips: ["选择高质量的文本材料进行深度学习", "尝试主动阅读法，边读边提问", "定期总结阅读内容，形成自己的知识体系"]
        },
        { 
          text: "逻辑思维", value: 78, color: "#F8A5C2",
          description: "您的逻辑思维能力较强，善于分析问题并寻找逻辑关系。",
          tips: ["学习时尝试找出概念之间的逻辑联系", "解决问题时采用系统性思考方法", "练习逻辑推理题目来强化这一能力"]
        },
        { 
          text: "实践操作", value: 72, color: "#FFD166",
          description: "您通过实际操作和亲身体验能够较好地掌握知识和技能。",
          tips: ["尽可能将理论学习与实践活动结合", "参与动手项目和实验来巩固所学内容", "通过教授他人来深化自己的理解"]
        },
        { 
          text: "创新思维", value: 70, color: "#6A0572",
          description: "您有一定的创新思维能力，能够从新角度思考问题。",
          tips: ["尝试不同的解决问题方法", "跨学科学习以获取多样化视角", "定期进行头脑风暴练习"]
        },
        { 
          text: "自我反思", value: 75, color: "#118AB2",
          description: "您具有良好的自我反思能力，能够从经验中学习并调整方法。",
          tips: ["保持学习日志，记录思考和感悟", "定期回顾学习过程并总结经验", "设定明确的改进目标"]
        },
        { 
          text: "听觉学习", value: 65, color: "#FF9E00",
          description: "您的听觉学习能力处于中等水平，通过听讲和讨论可以获取一定信息。",
          tips: ["录制并回听重要的讲座或学习内容", "参与小组讨论以加深理解", "尝试将听到的内容转化为视觉笔记"]
        },
        { 
          text: "团队合作", value: 68, color: "#06D6A0",
          description: "您在团队学习中表现良好，能够与他人有效合作。",
          tips: ["积极参与小组学习活动", "主动分享知识并倾听他人观点", "利用多元思维碰撞来拓展视野"]
        },
        { 
          text: "时间管理", value: 60, color: "#26547C",
          description: "您的时间管理能力有待提升，可以通过合理规划提高学习效率。",
          tips: ["使用时间块技术进行学习规划", "设定明确的学习目标和截止日期", "利用提醒工具避免拖延"]
        },
        { 
          text: "批判性思考", value: 76, color: "#FF4858",
          description: "您具有较强的批判性思考能力，能够评估信息并形成独立判断。",
          tips: ["主动质疑和验证学习内容", "从多个角度分析问题", "练习论证和反驳技能"]
        },
        { 
          text: "知识迁移", value: 74, color: "#9D4EDD",
          description: "您能够较好地将所学知识应用到新情境中。",
          tips: ["寻找不同领域知识之间的联系", "尝试在新场景中应用已学概念", "通过类比学习增强迁移能力"]
        },
        { 
          text: "专注力", value: 67, color: "#EF476F",
          description: "您的专注力处于中等水平，在适当环境下能够保持注意力。",
          tips: ["采用番茄工作法增强专注度", "创造无干扰的学习环境", "进行专注力训练练习"]
        },
        { 
          text: "多媒体学习", value: 88, color: "#073B4C",
          description: "您通过多媒体内容学习效果显著，能够整合不同形式的信息。",
          tips: ["利用多种媒体形式学习同一主题", "创建多媒体笔记加深理解", "寻找交互式学习资源"]
        },
        { 
          text: "结构化学习", value: 82, color: "#84A59D",
          description: "您偏好有明确结构的学习内容，能够在组织良好的框架中高效学习。",
          tips: ["为学习内容创建清晰的结构框架", "使用大纲和层级笔记法", "在学习前先了解知识体系全貌"]
        },
        { 
          text: "自主学习", value: 75, color: "#457B9D",
          description: "您具有良好的自主学习能力，能够独立规划和执行学习任务。",
          tips: ["设定个人学习目标和计划", "主动寻找学习资源", "定期评估学习成果并调整方向"]
        }
      ],
      
      // 雷达图数据
      tendencyData: [
        { name: "阅读学习", value: 85, color: "#4ECDC4", description: "您的阅读理解能力出色，比平均水平高出7%。您能从文本中迅速提取关键信息，理解复杂概念。" },
        { name: "实践操作", value: 72, color: "#FF6B6B", description: "您的实践操作能力良好，通过动手实践能够有效巩固知识。建议增加实践活动来提升学习效果。" },
        { name: "视觉学习", value: 90, color: "#FFD166", description: "视觉学习是您的显著优势，远高于平均水平。您对图像、视频等视觉内容有出色的理解和记忆能力。" },
        { name: "听觉学习", value: 65, color: "#118AB2", description: "您的听觉学习能力略低于平均，建议在听讲时结合视觉笔记或录音回听来增强理解。" },
        { name: "逻辑思维", value: 78, color: "#073B4C", description: "您的逻辑思维能力较强，善于分析问题并发现概念间的联系。这有助于您理解复杂的知识体系。" },
        { name: "创新思考", value: 70, color: "#F8A5C2", description: "您的创新思考能力处于中上水平，能够从不同角度思考问题。建议多参与开放性问题讨论。" },
        { name: "合作学习", value: 68, color: "#06D6A0", description: "您在团队学习环境中表现良好，能够与他人进行有效沟通和合作。这有助于拓宽您的学习视野。" }
      ],
      
      // 平均水平数据 
      averageData: [78, 70, 75, 72, 75, 68, 72]
    };
  },
  
  computed: {
    // 获取前5个最高分的特质
    topTraits() {
      return this.wordCloudData.sort((a, b) => b.value - a.value).slice(0, 5);
    }
  },
  
  onReady() {
    setTimeout(() => {
      this.initCanvasSizes();
      this.initRoseChart();
      this.initWordCloud();
      this.initParticles();
    }, 300);
  },
  
  methods: {
    // 获取用户名的首字母
    getUserInitial() {
      return this.userName.charAt(0);
    },
    
    // 格式化日期
    formatDate(date) {
      return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
    },
    
    // 页面跳转
    navigateToFeedback(type) {
      const routes = {
        contentPreference: '/pages/learnDashboard/contentPreference',
        strengthsWeaknesses: '/pages/learnDashboard/strengthsWeaknesses',
        learningSuggestions: '/pages/learnDashboard/learnSuggestions'
      };
      uni.navigateTo({ url: routes[type] });
    },
    
    // 初始化 canvas 尺寸
    initCanvasSizes() {
      const query = uni.createSelectorQuery();
      query.select('.word-cloud-canvas').boundingClientRect(res => {
        if (res) {
          this.canvasWidth = res.width;
          this.canvasHeight = res.height;
        }
      }).exec();
    },
    
    // 初始化玫瑰图
    initRoseChart() {
      const ctx = wx.createCanvasContext('roseChartCanvas', this);
      const width = this.canvasWidth;
      const height = this.canvasHeight;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35;
      
      // 绘制背景
      ctx.setFillStyle('rgba(249, 250, 252, 1)');
      ctx.fillRect(0, 0, width, height);
      
      // 绘制雷达图网格
      const indicatorCount = this.tendencyData.length;
      for (let i = 0; i < 4; i++) {
        const r = radius * (i + 1) / 4;
        ctx.beginPath();
        for (let j = 0; j < indicatorCount; j++) {
          const angle = (2 * Math.PI / indicatorCount) * j - Math.PI / 2;
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.setStrokeStyle('rgba(120, 120, 120, 0.1)');
        ctx.stroke();
      }
      
      // 绘制平均水平
      ctx.beginPath();
      for (let i = 0; i < indicatorCount; i++) {
        const value = this.averageData[i];
        const angle = (2 * Math.PI / indicatorCount) * i - Math.PI / 2;
        const r = (value / 100) * radius;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.setStrokeStyle('#999');
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // 绘制用户数据
      ctx.beginPath();
      for (let i = 0; i < indicatorCount; i++) {
        const value = this.tendencyData[i].value;
        const angle = (2 * Math.PI / indicatorCount) * i - Math.PI / 2;
        const r = (value / 100) * radius;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.setStrokeStyle('#4C6EF5');
      ctx.setFillStyle('rgba(76, 110, 245, 0.3)');
      ctx.fill();
      ctx.stroke();
      
      // 绘制指示器标签
      ctx.setFontSize(12);
      ctx.setFillStyle('#333');
      for (let i = 0; i < indicatorCount; i++) {
        const angle = (2 * Math.PI / indicatorCount) * i - Math.PI / 2;
        const x = centerX + (radius + 20) * Math.cos(angle);
        const y = centerY + (radius + 20) * Math.sin(angle);
        ctx.setTextAlign('center');
        ctx.fillText(this.tendencyData[i].name, x, y);
      }
      
      ctx.draw();
      
      // 点击事件处理
      wx.createSelectorQuery().select('#roseChartCanvas').node(res => {
        const canvas = res.node;
        canvas.addEventListener('tap', (e) => {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const angle = Math.atan2(y - centerY, x - centerX) + Math.PI / 2;
          const normalizedAngle = (angle < 0 ? angle + 2 * Math.PI : angle);
          const sectionAngle = 2 * Math.PI / indicatorCount;
          const index = Math.floor(normalizedAngle / sectionAngle) % indicatorCount;
          this.selectedAxis = this.tendencyData[index];
          this.selectedAxisColor = this.tendencyData[index].color;
        });
      }).exec();
    },
    
    // 初始化词云图
    initWordCloud() {
      const ctx = wx.createCanvasContext('wordCloudCanvas', this);
      const width = this.canvasWidth;
      const height = this.canvasHeight;
      
      // 设置背景
      ctx.setFillStyle('rgba(255, 255, 255, 0.05)');
      ctx.fillRect(0, 0, width, height);
      
      // 排序词云数据
      const sortedData = [...this.wordCloudData].sort((a, b) => b.value - a.value);
      
      // 计算字体大小范围
      const maxFontSize = 36;
      const minFontSize = 14;
      const maxValue = Math.max(...sortedData.map(item => item.value));
      const minValue = Math.min(...sortedData.map(item => item.value));
      
      // 中心点
      const centerX = width / 2;
      const centerY = height / 2;
      
      // 螺旋布局
      let angle = 0;
      let radius = 0;
      const spiralStep = 0.5;
      let placed = [];
      
      for (let i = 0; i < sortedData.length; i++) {
        const item = sortedData[i];
        const fontSize = minFontSize + ((item.value - minValue) / (maxValue - minValue)) * (maxFontSize - minFontSize);
        ctx.setFontSize(fontSize);
        ctx.setFillStyle(item.color);
        
        const textWidth = item.text.length * fontSize * 0.6;
        const textHeight = fontSize * 1.2;
        
        let positionFound = false;
        let attempts = 0;
        const maxAttempts = 200;
        
        while (!positionFound && attempts < maxAttempts) {
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          let collision = false;
          for (let j = 0; j < placed.length; j++) {
            const p = placed[j];
            const dx = Math.abs(x - p.x);
            const dy = Math.abs(y - p.y);
            if (dx < (textWidth + p.width) / 2 && dy < (textHeight + p.height) / 2) {
              collision = true;
              break;
            }
          }
          
          if (!collision && x > 0 && x < width && y > 0 && y < height) {
            positionFound = true;
            ctx.setTextAlign('center');
            ctx.setTextBaseline('middle');
            ctx.fillText(item.text, x, y);
            placed.push({ x, y, width: textWidth, height: textHeight });
          } else {
            angle += spiralStep;
            radius += spiralStep * 0.1;
            attempts++;
          }
        }
      }
      
      ctx.draw();
    },
    
    // 初始化粒子效果
    initParticles() {
      const ctx = wx.createCanvasContext('particleCanvas', this);
      const width = this.canvasWidth;
      const height = this.canvasHeight;
      const particles = [];
      
      // 创建粒子
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 6 + 2,
          color: this.wordCloudData[Math.floor(Math.random() * this.wordCloudData.length)].color,
          opacity: Math.random() * 0.6 + 0.1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5
        });
      }
      
      // 动画函数
      const animate = () => {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          p.x += p.speedX;
          p.y += p.speedY;
          
          if (p.x < 0 || p.x > width) p.speedX = -p.speedX;
          if (p.y < 0 || p.y > height) p.speedY = -p.speedY;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, 2 * Math.PI);
          ctx.setFillStyle(p.color);
          ctx.setGlobalAlpha(p.opacity);
          ctx.fill();
        });
        ctx.draw();
        requestAnimationFrame(animate);
      };
      
      animate();
    },
    
    // 显示特质详情
    showTraitDetail(trait) {
      this.modalTrait = trait;
      this.showModal = true;
    },
    
    // 关闭弹窗
    closeModal() {
      this.showModal = false;
    },
    
    // 分享报告
    shareReport() {
      uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
      uni.showToast({
        title: '分享功能已打开',
        icon: 'success'
      });
    }
  },
  
  // 自定义分享内容
  onShareAppMessage() {
    return {
      title: `${this.userName}的学习风格报告 - 我是${this.mainTrait}`,
      path: '/pages/learnSuggestion/learnSuggestion',
      imageUrl: '/static/share-image.png'
    };
  }
};
</script>

<style lang="scss" scoped>
@font-face {
  font-family: 'iconfont';
  src: url('//at.alicdn.com/t/c/font_3948516_z48erfu8m9.woff2') format('woff2');
}

.iconfont {
  font-family: 'iconfont';
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.learn-suggestion {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 40rpx;
}

.report-header {
  padding: 40rpx 30rpx;
  background: linear-gradient(135deg, #4c6ef5, #7952b3);
  color: #fff;
  border-radius: 0 0 40rpx 40rpx;
  margin-bottom: 30rpx;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 50%;
    height: 80%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    pointer-events: none;
  }
  
  .report-title {
    margin-bottom: 30rpx;
    
    .title-text {
      display: block;
      font-size: 44rpx;
      font-weight: 600;
      margin-bottom: 10rpx;
      letter-spacing: 1px;
    }
    
    .subtitle {
      font-size: 28rpx;
      opacity: 0.8;
    }
  }
  
  .user-profile {
    display: flex;
    align-items: center;
    
    .avatar {
      width: 90rpx;
      height: 90rpx;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
      box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.1);
      
      .avatar-text {
        font-size: 40rpx;
        font-weight: 600;
      }
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
      
      .user-name {
        font-size: 32rpx;
        font-weight: 500;
        margin-bottom: 5rpx;
      }
      
      .report-date {
        font-size: 24rpx;
        opacity: 0.8;
      }
    }
  }
}

.cloud-container {
  margin: 0 30rpx 30rpx;
  background: linear-gradient(to bottom, #051937, #2e4370);
  border-radius: 20rpx;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.15);
  overflow: hidden;
  position: relative;
  
  .cloud-wrapper {
    padding: 30rpx;
    
    .cloud-headline {
      text-align: center;
      margin-bottom: 30rpx;
      
      .headline-text {
        display: block;
        color: rgba(255, 255, 255, 0.7);
        font-size: 28rpx;
        margin-bottom: 10rpx;
      }
      
      .headline-tag {
        display: block;
        color: #fff;
        font-size: 48rpx;
        font-weight: 700;
        background: linear-gradient(to right, #FF6B6B, #4ECDC4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
    
    .cloud-canvas-container {
      height: 500rpx;
      position: relative;
      margin-bottom: 30rpx;
      
      .word-cloud-canvas,
      .particle-canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      
      .particle-canvas {
        z-index: 0;
      }
      
      .word-cloud-canvas {
        z-index: 1;
      }
    }
    
    .cloud-desc {
      text-align: center;
      margin-bottom: 30rpx;
      
      .desc-title {
        display: block;
        color: rgba(255, 255, 255, 0.9);
        font-size: 30rpx;
        font-weight: 500;
        margin-bottom: 8rpx;
      }
      
      .desc-subtitle {
        display: block;
        color: rgba(255, 255, 255, 0.6);
        font-size: 24rpx;
      }
    }
    
    .key-traits {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20rpx;
      padding: 10rpx 0;
      
      .trait-tag {
        padding: 12rpx 24rpx;
        border-radius: 50rpx;
        display: flex;
        align-items: center;
        gap: 10rpx;
        
        .trait-text {
          font-size: 26rpx;
          color: #fff;
          font-weight: 500;
        }
        
        .trait-value {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
}

.tendency-section {
  background-color: #fff;
  border-radius: 20rpx;
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.05);
  
  .card-header {
    margin-bottom: 20rpx;
    
    .card-title {
      display: block;
      font-size: 34rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }
    
    .card-subtitle {
      font-size: 26rpx;
      color: #666;
    }
  }
  
  .rose-chart-container {
    height: 500rpx;
    background-color: #f9fafc;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    
    .rose-chart {
      width: 100%;
      height: 100%;
    }
  }
  
  .axis-indicator {
    background-color: #f9fafc;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    
    .indicator-color {
      width: 8rpx;
      height: 40rpx;
      border-radius: 4rpx;
      margin-right: 15rpx;
      margin-bottom: 10rpx;
    }
    
    .indicator-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10rpx;
      
      .indicator-name {
        font-size: 30rpx;
        font-weight: 600;
        color: #333;
      }
      
      .indicator-value {
        font-size: 30rpx;
        font-weight: 600;
      }
    }
    
    .indicator-bar {
      height: 10rpx;
      background-color: #f1f3f5;
      border-radius: 5rpx;
      margin-bottom: 15rpx;
      overflow: hidden;
      
      .indicator-fill {
        height: 100%;
        border-radius: 5rpx;
        transition: width 0.5s ease;
      }
    }
    
    .indicator-desc {
      font-size: 26rpx;
      color: #666;
      line-height: 1.5;
    }
  }
}

.navigation-section {
  margin: 0 30rpx 30rpx;
  
  .card-heading {
    margin-bottom: 20rpx;
    
    .heading-title {
      display: block;
      font-size: 34rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }
    
    .heading-subtitle {
      font-size: 26rpx;
      color: #666;
    }
  }
  
  .nav-cards {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    
    .nav-card {
      background-color: #fff;
      border-radius: 20rpx;
      padding: 24rpx;
      box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      
      &:active {
        transform: scale(0.98);
        box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
      }
      
      .card-icon {
        width: 80rpx;
        height: 80rpx;
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 20rpx;
        
        .iconfont {
          color: #fff;
          font-size: 40rpx;
        }
      }
      
      .card-content {
        flex: 1;
        
        .card-title {
          display: block;
          font-size: 32rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 8rpx;
        }
        
        .card-desc {
          display: block;
          font-size: 26rpx;
          color: #666;
        }
      }
      
      .card-action {
        display: flex;
        align-items: center;
        
        .action-text {
          font-size: 28rpx;
          color: #4C6EF5;
          margin-right: 8rpx;
        }
        
        .icon-arrow {
          font-size: 28rpx;
          color: #4C6EF5;
        }
      }
    }
  }
}

.share-card {
  background-color: #fff;
  border-radius: 20rpx;
  margin: 0 30rpx 30rpx;
  padding: 30rpx;
  box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .share-content {
    .share-title {
      display: block;
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 8rpx;
    }
    
    .share-desc {
      font-size: 26rpx;
      color: #666;
    }
  }
  
  .share-button {
    background-color: #4C6EF5;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15rpx 30rpx;
    border-radius: 50rpx;
    box-shadow: 0 5rpx 15rpx rgba(76, 110, 245, 0.3);
    
    .icon-share {
      font-size: 28rpx;
      margin-right: 10rpx;
    }
    
    .button-text {
      font-size: 28rpx;
    }
  }
}

.trait-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .modal-content {
    width: 80%;
    max-height: 80vh;
    background-color: #fff;
    border-radius: 20rpx;
    overflow: hidden;
    
    .modal-header {
      padding: 30rpx;
      background-color: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .modal-title {
        font-size: 34rpx;
        font-weight: 600;
        color: #333;
      }
      
      .modal-close {
        font-size: 36rpx;
        color: #666;
      }
    }
    
    .modal-body {
      padding: 30rpx;
      max-height: calc(80vh - 90rpx);
      overflow-y: auto;
      
      .trait-score {
        text-align: center;
        margin-bottom: 30rpx;
        
        .score-value {
          display: block;
          font-size: 60rpx;
          font-weight: 700;
          color: #4C6EF5;
          margin-bottom: 10rpx;
        }
        
        .score-label {
          font-size: 28rpx;
          color: #666;
        }
      }
      
      .trait-description {
        margin-bottom: 30rpx;
        
        .description-title {
          display: block;
          font-size: 32rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 15rpx;
        }
        
        .description-content {
          font-size: 28rpx;
          color: #333;
          line-height: 1.6;
        }
      }
      
      .trait-tips {
        .tips-title {
          display: block;
          font-size: 32rpx;
          font-weight: 500;
          color: #333;
          margin-bottom: 15rpx;
        }
        
        .tips-list {
          .tip-item {
            display: flex;
            margin-bottom: 15rpx;
            
            .tip-bullet {
              margin-right: 10rpx;
              color: #4C6EF5;
            }
            
            .tip-text {
              flex: 1;
              font-size: 28rpx;
              color: #333;
              line-height: 1.6;
            }
          }
        }
      }
    }
  }
}
</style>