/**
 * 获取文件访问链接
 * @param {*} _this
 * @param {string} name
 * @returns {string}
 */
export async function getFileUrl(_this, name) {
  if (name) {
    try {
      const res = await _this.$http.get(
        "/api/learning/getMinIoUrl",
        {
          params: {
            fileName: name
          }
        }
      );
      const { status, data } = res.data
      if (status === 0 && data.url)
        return data.url
      else
        return ""
    } catch (e) {
      return ""
    }
  }
  return ""
}
