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

export class EnumHelper {
  static getEnumIndex(enumType: any, value: any): number {
    let index = -1
    for (const key in enumType) {
      if (enumType[key] === value) {
        index = Number.parseInt(key)
        break
      }
    }
    return index
  }

  static getInstance(enumType: any, value: number): T {
    return enumType[value]
  }
}

console.log(EnumHelper.getEnumIndex(Color, 'Green'))
console.log('EnumHelper.getInstance', EnumHelper.getInstance(Color, 1))
console.log('EnumHelper.getInstance', EnumHelper.getInstance(TaskType, 1))
console.log('EnumHelper.getInstance', EnumHelper.getInstance(TaskType, 2))
console.log('EnumHelper.getInstance', EnumHelper.getInstance(TaskType, 3))
