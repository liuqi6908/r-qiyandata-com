/**
 * 校验是否为会员
 * @param {*} _this
 * @returns {boolean}
 */
export function isVip(_this) {
  if (_this.userInfo.isVip) return true;
  const title = "该功能仅限会员用户使用，请前往会员权益购买会员！";
  _this
    .$confirm(title, "提示", {
      confirmButtonText: "立即前往",
      cancelButtonText: "取消",
      type: "warning"
    })
    .then(() => {
      _this.$router.push({
        name: "Vip",
        params: {
          buyVip: true
        }
      });
    })
    .catch(() => {});
  return false;
}

/**
 * 判断是否为url
 * @param {string} url
 * @returns {boolean}
 */
export function isUrl(url) {
  const regexp = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  // 使用正则表达式判断字符串是否符合 URL 格式
  if (!regexp.test(url)) return false;

  try {
    // 判断该地址是否存在或可访问
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}
