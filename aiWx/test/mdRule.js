import { initHighLight, convertMarkdown } from "../tools/markdownUtils.js";

initHighLight()
let testData2 = '作为一名初级前端工程师，学习Python可以为你的技能树增添强大的后端开发能力，并且有助于你向全栈开发方向发展。下面是一份基于你当前背景的学习路径规划：## 现状分析- **职业定位**：前端工程师-**目标语言**：Python- **潜在应用领域**：- Web后端开发Flask框架）-数据分析与数据可视化- 自动化脚本编写- 人工智能与机器学习基础##目标拆解1. **掌握Python基础语法**2. **学习至少一个PythonWeb框架（如Django或Flask）**3. **理解前后端交互机制（API设计、RESTful服务等）**4. **实践项目经验积累**## 执行步骤### 第一阶段：入门python.org](https://docs.python.org/zh-cn/3/tutorial/index.html))- Coursera上的“Python for Everybody”课程-廖雪峰的Python教程-技能点：-变量、数据类型、条件判断、循环- 函数定义与调用- 异常处理- 文件操作### 第二阶段：Web后端开发 (预计2-3个月)-框架选择：Django（适合快速构建复杂应用）或Flask（轻量级，适合小型项目和微服务）-学习内容：- MVC架构模式-数据库ORM映射（如Django ORM）- RESTful API设计- 用户认证与授权- 推荐书籍：《Django企业开发实战》、《Flask Web开发：基于Python的Web应用开发实战》###第三阶段：项目实践(持续进行)- 创建个人博客系统或者任务管理工具作为起步项目-尝试参与开源项目贡献代码-在GitHub上维护自己的代码仓库并撰写技术博客分享经验---接下来，我可以帮你查找一些具体的在线课程链接以及相关教材评价信息，请问需要我进一步协助吗？'
let testData = '### 你好'
const data = convertMarkdown(testData)
console.log(data);
