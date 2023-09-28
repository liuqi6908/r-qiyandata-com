import $ from 'jquery'

// 输入六位验证码
// 初始化映射
const codes = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function code_input() {
  let elems = document.getElementsByClassName("code_input");

  for (let i = 0; i < elems.length; i++) {
    $(elems[i]).keydown(function (ev) {
      return event_code_delete(ev, this)
    });
  }
}

function event_code_input(ev, elem) {
  let code = ev.originalEvent.data;
  if (!codes.includes(code)) {
    elem.value = "";
  } else {
    elem.value = code;
    let index = elem.getAttribute("data-index");
    if (index < 5)
      $(elem.parentElement.nextElementSibling.firstElementChild).focus();
    else
      $(elem).blur();
  }
  return false;
}

function event_code_delete(ev, elem) {
  let code = ev.key;
  let key = ev.keyCode;
  let index = elem.getAttribute("data-index");

  // 删除
  if (key === 8) {
    elem.value = "";
    if (index > 0)
      $(elem.parentElement.previousElementSibling.firstElementChild).focus();
  }
  // 数字
  else if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
    if (codes.includes(code)) {
      elem.value = code;
      if (index < 5)
        $(elem.parentElement.nextElementSibling.firstElementChild).focus();
      else
        $(elem).blur();
    } else {
      elem.value = "";
    }
  }
  // Tab
  else if (key === 9) {
    return true;
  }
  // 移动端
  else if (key === 229) {
    $(elem).on('textInput', function (ev) {
      return event_code_input(ev, this)
    });
    if (!codes.includes(elem.value))
      elem.value = "";
  }
  // 其他按钮
  else {
    elem.value = "";
  }
  return false;
}
