export interface Untyped {
 /** @default "earth" */
 name: string,

 specs: {
  /** @default 9.8 */
  gravity: number,

  /**
   * planet moons
   * 
   * @default ["moon"]
  */
  moons: Array<string>,
 },
}