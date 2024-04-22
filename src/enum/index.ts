export enum TaskType {
  FIXED_UNITS = 'FIXED_UNITS',
  FIXED_DURATION = 1,
  FIXED_WORK,
}

console.log(TaskType.FIXED_UNITS)
console.log(TaskType[2])
// console.log(TaskType.FIXED_WORK === TaskType2.FIXED_WORK)

enum Color {
  Red,
  Green,
  Blue,
}

const colorNumber = 0 // 假设这是您手头的枚举值

// 使用枚举类型名加上方括号表示法，传入枚举值来获取成员名
const colorName = Color[colorNumber]

console.log(colorName) // 输出: "Red"
