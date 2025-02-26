function htmlToText(html){
  return html
  // .replace(/(<\/?[\S]+\/>?)+/g,"")
  .replace(/<[^>]+>/g, '')
    .replace(/&gt;/g,">")
    .replace(/&lt;/g,"<")
    .replace(/&amp;/g,"&")
    .replace(/%nbsp;/g," ")
    .replace(/\s+/g," ")
    .replace(/&quot;/g,"")
    .trim()
}

export {
  htmlToText
}