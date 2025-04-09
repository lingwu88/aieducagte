import { marked } from 'marked'
import hljs from "highlight.js"
// import "highlight.js/scss/atom-one-dark.scss"

// 单例模式初始化
let isInitialized = false;
// 初始化高亮配置
const initHighLight = () => {
  if (isInitialized) return;
  hljs.configure({
    useBR: true,
    tabReplace: " ",
    ignoreUnescapedHTML: true
  });
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    highlight: (code, lang) => {
      try {
        return lang && hljs.getLanguage(lang)
          ? hljs.highlight(code, { language: lang }).value
          : hljs.highlightAuto(code).value;
      } catch (e) {
        return code; // 异常时返回原始代码
      }
    }
  });
  isInitialized = true;
};

// 处理Markdown转换
const convertMarkdown = (content) => {
  // const withLineBreaks = content.replace(/\\n/g, '<br>');
  return marked(content).replace(/<pre>/g, "<pre class='hljs'>");
};

// 导出模块
export { initHighLight, convertMarkdown };