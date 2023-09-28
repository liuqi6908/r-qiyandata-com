import { copyText } from './tool'

document.addEventListener('copy', (event) => {
  const text = '本内容摘自企研·社科大数据平台（https://r.qiyandata.com），更多信息敬请关注公众号“社科大数据”，转载请注明出处！'
  const str = window.getSelection().toString();
  if (!str.endsWith(text)) {
    event.preventDefault();
    copyText(`${str}\n${text}`);
  }
});