
// EventManager.js - 負責判斷特殊節日
module.exports.getEvent = function() {
  const d = new Date()
  const day = d.getDay()   // 0(週日) - 6(週六)
  const date = d.getDate() // 1 - 31
  
  // 邏輯 1: 每個月的第一個禮拜六 (First Saturday)
  // 條件: 星期六 (6) 且日期在 1~7 號之間
  if (day === 6 && date <= 7) {
    return "FS"
  }
  
  // 邏輯 2: 每個月的第二個禮拜天 (Second Sunday)
  // 條件: 星期日 (0) 且日期在 8~14 號之間
  if (day === 0 && date > 7 && date <= 14) {
    return "SS"
  }
  
  // 未來可擴充其他活動...
  
  return null // 一般日
}
