import data1 from "./data1.json";
import data2 from "./data2.json";
import data3 from './data3.json'

const colorArr = ["#7884F0", "#64C88C", "#F1BE1B", "#DA6A9A", "#909399"];

const list1 = data1.data.items.map((i) => ({
  id: i.id,
  width: i.note_card.cover.width,
  height: i.note_card.cover.height,
  title: i.note_card.display_title,
  author: i.note_card.user.nickname,
}));

const list2 = data2.data.items.map((i) => ({
  id: i.id,
  width: i.note_card.cover.width,
  height: i.note_card.cover.height,
  title: i.note_card.display_title,
  author: i.note_card.user.nickname,
}));

const list = [...list1, ...list2].map((item, index) => ({ bgColor: colorArr[index % (colorArr.length - 1)], ...item }));

export const indexList = data3.data.map(item=>({
  url:item.url,
  title:item.title,
  img:item.img
}))

export default list;
