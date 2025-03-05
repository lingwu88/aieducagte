
function htmlToText(html) {
  return html
    // .replace(/(<\/?[\S]+\/>?)+/g,"")
    .replace(/<[^>]+>/g, '')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&")
    .replace(/%nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&quot;/g, "")
    .trim()
}
function regexSSE(res) {
  let result = ''
  //提取出自打第一个data起的所有数据
  const dataPattern = /data:([\s\S]*)/gm; // 匹配以 "data: " 开头的行
  const dataPattern1 = /data:\s*(.*)/     //用来匹配子串的data
  let match = dataPattern.exec(res)

  //match[1]分割出的字符串可能含有三种情况：不包含retry，即纯文本，第二种：包含retry，那么肯定也包含data

  if (match && match[1]) {
    const data = match[1].trim(); // 提取 data 部分并去除多余空格
    //以两个换行符为分割
    let str = data.split(/\n\n/)
    for (let item of str) {
      
      //包含retry时，才需要正则提取，否则直接添加
      if (item.includes("retry")) {
        console.log('包含retry');
        // console.log(item);
        let item_match = dataPattern1.exec(item)
        // console.log(item_match);
        result+=item_match[1]
      }
      else
        result += item
    }
  }
  
  return result
  // return null
}

export {
  htmlToText,
  regexSSE
}
