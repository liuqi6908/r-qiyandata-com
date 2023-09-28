/**
 * 将毫秒值格式化为{d天hh:mm:ss}
 * @param {number} time
 * @returns
 */
export function formatTime(time) {
  let seconds = Math.floor(time / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  hours = hours % 24;
  minutes = minutes % 60;
  seconds = seconds % 60;

  return `${days}天${hours < 10 ? "0" : ""}${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

/**
 * 将日期格式化为{yyyy年MM月dd日hh时mm分ss秒}
 * @param {string | null} str
 */
export function formatDateTime(str) {
  const date = str ? new Date(str) : new Date();

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return `${year}年${month}月${day}日${hours}时${minutes}分${seconds}秒`;
}
