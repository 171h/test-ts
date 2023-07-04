/**
 * 模式匹配-让你 ts 类型体操水平暴增的套路
 *
 * 我们通过 extends 对传入的类型参数 T 做模式匹配，其中 value 部分是需要提取的，
 * 通过 infer 类声明一个局部变量 R 来保存，如果匹配，就返回匹配到的 R，否则就返回
 * never 代表没匹配到。
 *
 * 总结：
 * Typescript 类型的模式匹配是通过 extends 对类型参数做匹配， * 结果保存到通过
 * infer 声明的局部类型变量里，如果匹配就能从该 * 局部变量里拿到提取出的类型。
 *
 * {@link https://juejin.cn/post/7045536402112512007}
 */
type GetValueType<T> = T extends Promise<infer R> ? R : T
type PromiseType = Promise<number[]>

type res10 = GetValueType<PromiseType>

// array pop
type Pop<T extends unknown[]> =
  T extends [...infer Rest, infer Last] ? [...Rest] : never

type resPop = Pop<[1, 2, 3]>

// array shift
type Shift<T extends unknown[]> =
  T extends [infer First, ...infer Rest] ? [...Rest] : never

type resShift = Shift<[1, 2, 3]>

// string trim
type TrimLeft<Str extends string> =
  Str extends `${' ' | '\t' | '\n'}${infer Rest}` ? TrimLeft<Rest> : Str

type resTrimLeft = TrimLeft<'  123'>

type TrimRight<Str extends string> =
  Str extends `${infer Rest}${' ' | '\t' | '\n'}` ? TrimRight<Rest> : Str

type resTrimRight = TrimRight<'123  '>

type Trim<Str extends string> = TrimLeft<TrimRight<Str>>

type resTrim = Trim<'  123  '>

// string replace
type Repalce<Str extends string, From extends string, To extends string> =
  Str extends `${infer Rest1}${From}${infer Rest2}` ? Repalce<`${Rest1}${To}${Rest2}`, From, To> : Str

type resReplace = Repalce<'111123', '1', 'A'>
