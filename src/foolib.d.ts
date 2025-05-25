import { Hookable } from 'hookable';
export default class FooLib extends Hookable {
    constructor();
    someFunction(): Promise<void>;
    somFunction2(): Promise<string>;
}
