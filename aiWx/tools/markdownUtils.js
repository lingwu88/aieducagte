import { marked } from 'marked'
import hljs from "highlight.js"
import "highlight.js/scss/atom-one-dark.scss"

// 初始化高亮配置
const initHighLight = () => {
  hljs.configure({
    useBR: true,
    tabReplace: " ",
  });
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    highlight: (code, lang) => {
      return lang && hljs.getLanguage(lang) 
        ? hljs.highlightAuto(code, { language: lang }).value 
        : hljs.highlightAuto(code).value;
    }
  });
};

// 处理Markdown转换
const convertMarkdown = (content) => {
  const withLineBreaks = content.replace(/\\n/g, '<br>');
  return marked(withLineBreaks).replace(/<pre>/g, "<pre class='hljs'>");
};

// 导出模块
export { initHighLight, convertMarkdown };