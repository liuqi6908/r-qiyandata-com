// 生成唯一id
export function getId() {
    const s = [];
    const hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 15; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 36), 1);
    }
    s[5] = s[10] = "-";
    return s.join("");
}