import React from "react";
import { injectIntl } from "react-intl";

class Typescript extends React.Component {
  render() {
    // 布尔值
    // 最基本的数据类型就是简单的true/false值，在JavaScript和TypeScript里叫做boolean（其它语言中也一样）。
    let isDone: boolean = false;

    // 数字
    // 和JavaScript一样，TypeScript里的所有数字都是浮点数。 这些浮点数的类型是number。 除了支持十进制和十六进制字面量，TypeScript还支持ECMAScript 2015中引入的二进制和八进制字面量。
    let decLiteral: number = 6;
    let hexLiteral: number = 0xf00d;
    let binaryLiteral: number = 0b1010;
    let octalLiteral: number = 0o744;

    // 字符串
    // JavaScript程序的另一项基本操作是处理网页或服务器端的文本数据。 像其它语言里一样，我们使用string表示文本数据类型。 和JavaScript一样，可以使用双引号（"）或单引号（'）表示字符串。
    let name: string = `Gene`;
    let age: number = 37;
    let sentence: string = `Hello, my name is ${name}`;

    // 数组
    // TypeScript像JavaScript一样可以操作数组元素。 有两种方式可以定义数组。 第一种，可以在元素类型后面接上[]，表示由此类型元素组成的一个数组：
    let listA: number[] = [1, 2, 3];
    // 第二种方式是使用数组泛型，Array<元素类型>：
    let listB: Array<number> = [1, 2, 3];

    // 元组 Tuple
    // 元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为string和number类型的元组。

    // Declare a tuple type
    let x: [string, number];
    // Initialize it
    x = ["hello", 10]; // OK
    // Initialize it incorrectly
    //x = [10, "hello"];  Error

    // 当访问一个已知索引的元素，会得到正确的类型：
    console.log(x[0].substr(1)); // OK
    //console.log(x[1].substr(1));  Error, 'number' does not have 'substr'

    // 当访问一个越界的元素，会使用联合类型替代：
    //x[3] = "world";  OK, 字符串可以赋值给(string | number)类型
    //console.log(x[5].toString());  OK, 'string' 和 'number' 都有 toString
    //x[6] = true; // Error, 布尔不是(string | number)类型

    // 枚举
    // enum类型是对JavaScript标准数据类型的一个补充。 像C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。
    enum Color {
      Red,
      Green,
      Blue
    }
    let c: Color = Color.Green;

    // 任意值
    // 有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用any类型来标记这些变量：
    let notSure: any = 4;
    notSure = "maybe a string instead";
    notSure = false; // okay, definitely a boolean

    // 在对现有代码进行改写的时候，any类型是十分有用的，它允许你在编译时可选择地包含或移除类型检查。 你可能认为Object有相似的作用，就像它在其它语言中那样。 但是Object类型的变量只是允许你给它赋任意值 - 但是却不能够在它上面调用任意的方法，即便它真的有这些方法：
    notSure.ifItExists(); // okay, ifItExists might exist at runtime
    notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

    let prettySure: Object = 4;
    //prettySure.toFixed();  Error: Property 'toFixed' doesn't exist on type 'Object'.

    // 当你只知道一部分数据的类型时，any类型也是有用的。 比如，你有一个数组，它包含了不同的类型的数据：
    let list: any[] = [1, true, "free"];
    list[1] = 100;

    // 空值
    // 某种程度上来说，void类型像是与any类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是void：

    function warnUser(): void {
      console.log("This is my warning message");
    }

    function sayHi(person: string) {
      return `Hi, ${person}`;
    }

    console.log(sayHi("董小姐"));

    // 声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：
    let unusable: void = undefined;

    return <div />;
  }
}

export default Typescript;
