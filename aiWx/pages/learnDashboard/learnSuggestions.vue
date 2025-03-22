<template>
  <view class="learn-suggestions">
    <!-- 顶部标题区域 -->
    <view class="header">
      <view class="title">学习建议</view>
      <view class="subtitle">根据您的学习情况定制的专属建议</view>
    </view>
    
    <!-- 内容区域 -->
    <view class="content-container">
      <scroll-view scroll-y class="content-scroll">
        <view class="markdown-content">
          <view v-if="loading" class="loading">
            <view class="loading-spinner"></view>
            <text>加载中...</text>
          </view>
          <block v-else>
            <view 
              v-for="(item, index) in parsedSuggestions" 
              :key="index"
              class="suggestion-item"
              :class="{'animate-in': !loading}"
              :style="{'animation-delay': index * 0.1 + 's'}"
            >
              <view class="suggestion-number">{{item.number}}</view>
              <view class="suggestion-content">
                <view class="suggestion-title">{{item.title}}</view>
                <view class="suggestion-text" v-html="item.content"></view>
              </view>
            </view>
          </block>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      suggestions: '',
      parsedSuggestions: [],
      loading: true
    };
  },
  
  onLoad() {
    // 模拟从后端获取数据
    this.fetchSuggestions();
  },
  
  methods: {
    fetchSuggestions() {
      // 这里模拟API调用，实际项目中应替换为真实的API请求
      const mockResponse = {
        "result": "1. **考研方向建议**：  \n   您的目标院校是深圳大学，且当前专业为土木工程。建议优先巩固「材料力学」和「房屋建筑学」等核心课程，同时针对性复习目标院校的考研大纲内容。此外，可结合「工程制图」的实际案例提升解题能力，确保专业课分数优势。\n\n2. **转行人工智能路径**：  \n   您对「数据结构与算法」和「人工智能」有浓厚兴趣，这为核心转型提供了良好基础。建议从以下方向入手：  \n   - 深入学习「数据结构与算法」，掌握常见算法（如动态规划、图算法）并实践LeetCode或牛客网题目。  \n   - 学习人工智能相关基础知识，包括机器学习、深度学习框架（如TensorFlow、PyTorch）。  \n   - 结合「计算机科学」背景，尝试完成一些小项目，例如图像识别或自然语言处理任务，积累实战经验。\n\n3. **创业技能储备**：  \n   创业需要技术与商业思维兼备。建议在学习「人工智能」的同时，补充产品设计、市场分析等相关知识。例如，学习如何将AI技术应用于实际场景（如智能建筑、数据分析平台），并尝试参与创新创业比赛积累经验。\n\n4. **时间管理与学习习惯优化**：  \n   如果您目前的学习时间较为分散，建议制定每日固定学习计划，专注于高优先级领域（如考研复习或人工智能学习）。可以结合番茄工作法，每25分钟专注学习后休息5分钟，以提高效率。\n\n5. **跨学科应用探索**：  \n   您的学习领域涵盖「土木工程」与「人工智能」，这是跨学科创新的好机会。例如，研究如何用AI优化建筑设计或预测建筑材料性能，既符合您的专业背景，又能突出人工智能的应用价值，为未来考研或创业提供独特竞争力。"
      };
      
      this.suggestions = mockResponse.result;
      this.parseSuggestions();
      
      // 模拟加载时间
      setTimeout(() => {
        this.loading = false;
      }, 800);
    },
    
    parseSuggestions() {
      // 使用正则表达式解析建议内容
      const regex = /(\d+)\.\s+\*\*(.*?)\*\*：([\s\S]*?)(?=\n\n\d+\.|$)/g;
      let match;
      const suggestions = [];
      
      while ((match = regex.exec(this.suggestions)) !== null) {
        const number = match[1];
        const title = match[2];
        let content = match[3].trim();
        
        // 处理内容中的Markdown格式
        content = this.formatMarkdown(content);
        
        suggestions.push({
          number,
          title,
          content
        });
      }
      
      this.parsedSuggestions = suggestions;
    },
    
    formatMarkdown(text) {
      return text
        // 处理粗体
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        
        // 处理斜体
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // 处理引用文本
        .replace(/「(.*?)」/g, '<span class="highlight">$1</span>')
        
        // 处理列表项
        .replace(/^\s*-\s+(.*?)$/gm, '<li>$1</li>')
        
        // 处理列表
        .replace(/<li>.*?<\/li>(\n<li>.*?<\/li>)*/gs, match => {
          return '<ul class="suggestion-list">' + match + '</ul>';
        })
        
        // 处理段落
        .replace(/\n\n/g, '</p><p>')
        
        // 确保内容被包裹在段落标签中
        .replace(/^(?!<p>|<ul>)(.+)/, '<p>$1</p>')
        
        // 修复可能的HTML问题
        .replace(/<\/p><p><\/ul>/g, '</ul>')
        .replace(/<p><ul/g, '<ul');
    }
  }
};
</script>

<style lang="scss">
.learn-suggestions {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fd;
  
  .header {
    background: linear-gradient(135deg, #5b6af0, #7b89ff);
    padding: 40rpx 30rpx;
    color: #fff;
    border-radius: 0 0 30rpx 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(91, 106, 240, 0.2);
    position: relative;
    overflow: hidden;
    
    &:after {
      content: '';
      position: absolute;
      right: -20rpx;
      bottom: -20rpx;
      width: 200rpx;
      height: 200rpx;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }
    
    &:before {
      content: '';
      position: absolute;
      left: -30rpx;
      top: -30rpx;
      width: 160rpx;
      height: 160rpx;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }
    
    .title {
      font-size: 44rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
      position: relative;
      z-index: 2;
    }
    
    .subtitle {
      font-size: 28rpx;
      opacity: 0.9;
      position: relative;
      z-index: 2;
    }
  }
  
  .content-container {
    flex: 1;
    margin: 30rpx;
    background-color: #fff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
    overflow: hidden;
    
    .content-scroll {
      height: calc(100vh - 240rpx);
    }
    
    .markdown-content {
      padding: 30rpx;
      
      .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300rpx;
        
        .loading-spinner {
          width: 60rpx;
          height: 60rpx;
          border: 6rpx solid rgba(91, 106, 240, 0.1);
          border-left-color: #5b6af0;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20rpx;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      }
      
      .suggestion-item {
        display: flex;
        margin-bottom: 40rpx;
        background-color: #fff;
        border-radius: 16rpx;
        padding: 24rpx;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
        position: relative;
        opacity: 0;
        transform: translateY(20rpx);
        
        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 6rpx;
          background: linear-gradient(to bottom, #5b6af0, #7b89ff);
          border-radius: 0;
        }
        
        &.animate-in {
          animation: fadeInUp 0.5s forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20rpx);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .suggestion-number {
          font-size: 40rpx;
          font-weight: bold;
          color: #5b6af0;
          margin-right: 20rpx;
          min-width: 40rpx;
          text-align: center;
        }
        
        .suggestion-content {
          flex: 1;
          
          .suggestion-title {
            font-size: 32rpx;
            font-weight: bold;
            margin-bottom: 16rpx;
            color: #333;
          }
          
          .suggestion-text {
            p {
              font-size: 30rpx;
              line-height: 1.6;
              color: #666;
              margin: 16rpx 0;
            }
            
            strong {
              color: #5b6af0;
              font-weight: 600;
            }
            
            em {
              font-style: italic;
              color: #666;
            }
            
            .highlight {
              color: #7b89ff;
              font-weight: 500;
              background-color: rgba(123, 137, 255, 0.08);
              padding: 0 6rpx;
              border-radius: 6rpx;
            }
            
            .suggestion-list {
              margin: 20rpx 0 20rpx 10rpx;
              padding: 0;
              
              li {
                position: relative;
                list-style: none;
                padding-left: 30rpx;
                margin-bottom: 16rpx;
                font-size: 28rpx;
                line-height: 1.5;
                color: #666;
                
                &:before {
                  content: '';
                  position: absolute;
                  left: 0;
                  top: 14rpx;
                  width: 12rpx;
                  height: 12rpx;
                  background-color: #7b89ff;
                  border-radius: 50%;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
