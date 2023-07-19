type Last<Arr extends unknown[]> =
  Arr extends [...infer rest, infer Ele] ? Ele : never

type res = Last<[1, 2, 3]>

type GetReturnType<Func extends Function> =
  Func extends (...args: any[]) => infer ReturnType ? ReturnType : never

type res2 = GetReturnType<() => '171h'>

type ReplaceStr<Str extends string, From extends string, To extends string> =
  Str extends `${infer Prefix}${From}${infer Suffix}` ? `${Prefix}${To}${Suffix}` : Str

type res3 = ReplaceStr<'foo', 'oo', 'ee'>

// if 和 else
type A = 1
type B = 2
type Example = A extends B ? true : false

// 模式匹配
type AA = [1, 2, 3]
type ExampleAA = A extends [infer First, ...infer Rest] ? First : never
type BB = '123'
type ExampleBB = BB extends `${infer FirstChar}${infer Rest}` ? FirstChar : never

// interface Parent <: Node {
//   children: [Node]
// }

// interface Point {
//   line: number >= 1
//   column: number >= 1
//   offset: number >= 0?
// }
