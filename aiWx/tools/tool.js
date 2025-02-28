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
function regexSSE(res){
  let result = ''
  const dataPattern = /data:\s*(.*)/; // 匹配以 "data: " 开头的行
  let match = dataPattern.exec(res)
  
  // while ((match = dataPattern.exec(res)) !== null) {
  //   const data = match[1].trim(); // 提取 data 部分并去除多余空格
  //   console.log('Extracted Data:', data); // 打印提取的数据
  //   result += data; // 将提取的数据添加到 result.word
  // }
  console.log(match);
  
  if (match && match[1]) {
    const data = match[1].trim(); // 提取 data 部分并去除多余空格
    console.log(res);
    
    return data
    console.log('Extracted Data:', data); // 打印提取的数据
  }
  return result
  return null
}

export {
  htmlToText,
  regexSSE
}
