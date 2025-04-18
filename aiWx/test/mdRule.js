import { initHighLight, convertMarkdown } from "../tools/markdownUtils.js";

let originData = "Python是一个非常棒的选择，它是一门广泛应用于Web开发、数据分析、人工智能等多个领域的编程语言。为了给你提供一个系统的学习路径，我将按照以下步骤来规划：1. **需求理解阶段**-确认你的当前年级和专业背景（例如：大一计算机科学专业）-识别你学习Python的目的（例如：为了完成课程项目、准备实习、个人兴趣等）2. **智能增强阶段**-搜索最适合初学者的Python学习资源- 提取有关Python编程的课程大纲和学习材料3. **方案生成阶段**-根据你的背景和目标，定制个性化的学习计划-列出推荐的在线课程、书籍和实践项目现在，让我们开始第一步。请告诉我你的年级、专业以及学习Python的主要目的。之后，我会使用我的工具来搜索和提取相关信息，为你构建一个详细的学习计划。"

function filterSSE(text) {
  const data = text.split('\n')
  console.log('data' + data);

  const data2 = data
    .map(line => line.replace(/^(retry:\d+|data:)*/, "").trim())
    .filter(Boolean)
    .join('');
  console.log('data2' + data2);

  return data
}


initHighLight()
let testData4 = 'Python是个很好的选择，它是一门广泛应用于Web开发、数据分析、人工智能等多个领域的高级编程语言。下面我会为你提供一个结构化的学习路径图，帮助你从入门到进阶。### 现状分析'
let testData3 = 'Python是个很好的选择，它是一门广泛应用于Web开发、数据分析、人工智能等多个领域的高级编程语言。下面我会为你提供一个结构化的学习路径图，帮助你从入门到进阶。### 现状分析- **当前技能水平**：假设你是编程新手。- **目标**：掌握Python基础及进阶知识，并能应用于实际项目中。### 目标拆解1. **基础知识学习**：变量、数据类型、控制流语句等。2.**进阶知识学习**：函数、类与对象、异常处理等。3.**库和框架**：熟悉常用的Python库如NumPy, pandas, matplotlib等。4.**实践项目**：通过实际项目练习所学知识。### 执行步骤#### 第一步：基础知识学习- **推荐资源**： '
let testData2 = '作为一名初级前端工程师，学习Python可以为你的技能树增添强大的后端开发能力，并且有助于你向全栈开发方向发展。下面是一份基于你当前背景的学习路径规划：## 现状分析- **职业定位**：前端工程师-**目标语言**：Python- **潜在应用领域**：- Web后端开发Flask框架）-数据分析与数据可视化- 自动化脚本编写- 人工智能与机器学习基础##目标拆解1. **掌握Python基础语法**2. **学习至少一个PythonWeb框架（如Django或Flask）**3. **理解前后端交互机制（API设计、RESTful服务等）**4. **实践项目经验积累**## 执行步骤### 第一阶段：入门python.org](https://docs.python.org/zh-cn/3/tutorial/index.html))- Coursera上的“Python for Everybody”课程-廖雪峰的Python教程-技能点：-变量、数据类型、条件判断、循环- 函数定义与调用- 异常处理- 文件操作### 第二阶段：Web后端开发 (预计2-3个月)-框架选择：Django（适合快速构建复杂应用）或Flask（轻量级，适合小型项目和微服务）-学习内容：- MVC架构模式-数据库ORM映射（如Django ORM）- RESTful API设计- 用户认证与授权- 推荐书籍：《Django企业开发实战》、《Flask Web开发：基于Python的Web应用开发实战》###第三阶段：项目实践(持续进行)- 创建个人博客系统或者任务管理工具作为起步项目-尝试参与开源项目贡献代码-在GitHub上维护自己的代码仓库并撰写技术博客分享经验---接下来，我可以帮你查找一些具体的在线课程链接以及相关教材评价信息，请问需要我进一步协助吗？'
let testData = '我真是服了\n### 你好'
let testData1 = '-  我是列表\n- 我是子列表'
let testData5 = '\n 1. '
const data = convertMarkdown(testData5)
console.log(data);
