/**
 * 使用栈， 完成中序表达式转后续表达式
 * 输入: ["12", "+", "3"]
 * 输出: ["12", "3", "+"]
 * 输入: ["(", "1", "+", "(", "4", "+", "5", "+", "3", ")", "-", "3", ")", "+", "(", "9", "+", "8", ")" ]
 * 输出: ['1', '4', '5', '+', '3', '+', '+', '3', '-', '9', '8', '+', '+']
 * 输入: ['(', '1', '+', '(', '4', '+', '5', '+', '3', ')', '/', '4', '-', '3', ')', '+', '(', '6', '+', '8', ')', '*', '3']
 * 输出: ['1', '4', '5', '+', '3', '+', '4', '/', '+', '3', '-', '6', '8', '+', '3', '*', '+']
 */


/**
 * 思路
 * 定义数组postfix_lst， 用于存储后缀表达式， 遍历中缀表达式， 对每一个遍历到的元素做如处理:
 * 1、 如果是数字, 直接放入到postfix_lst中
 * 2、 遇到左括号入栈
 * 3、 遇到右括号, 把栈顶元素弹出并放入到postfix_lst中, 直到遇到左括号， 最后弹出左括号
 * 4、 遇到运算符, 把栈顶的运算符弹出, 直到栈顶的运算符优先级小于当前运算符， 把弹出的运算符加入到postfix_lst， 当前的运算符入栈
 * 5、 for循环结束后, 栈里可能还有元素, 都弹出放入到postfix_lst中
 * 
 * 准备一个暂存栈，一个结果数组，遍历给出的数组，出现数字直接push进结果数组
 * 遇到符号或者(就push进栈，并且，如果是符号，就检测栈顶是不是符号，如果是就弹出push进结果数组
 * 如果遇到了)就检测栈顶元素，如果是符号就弹出，直到遇到(，弹出(，结束
 */

Stack = require('./mystack.js')

// 定义运算符的优先级
var priority_map = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2
};

function infix_exp_2_postfix_exp(exp) {
    var stack = new Stack.Stack();

    var postfix_lst = [];
    for (var i = 0; i < exp.length; i++) {
        var item = exp[i];

        if (!isNaN(item)) {
            postfix_lst.push(item); // 如果是数字,直接放入到postfix_lst中
        } else if (item == "(") {
            stack.push(item); // 遇到左括号入栈
        } else if (item == ")") {
            while (stack.top() != "(") { // 遇到右括号,把栈顶元素弹出,直到遇到左括号
                postfix_lst.push(stack.pop());
            }
            stack.pop(); // 左括号出栈
        } else {
            while (!stack.isEmpty() && ["+", "-", "*", "/"].indexOf(stack.top()) >= 0 &&
                priority_map[stack.top()] >= priority_map[item]) { // 遇到运算符,把栈顶的运算符弹出,直到栈顶的运算符优先级小于当前运算符
                // 直到栈顶的运算符优先级小于当前运算符
                postfix_lst.push(stack.pop()); // 把弹出的运算符加入到postfix_lst
            }
            stack.push(item); // 当前的运算符入栈
        }

    }

    // for循环结束后, 栈里可能还有元素,都弹出放入到postfix_lst中
    while (!stack.isEmpty()) {
        postfix_lst.push(stack.pop())
    }

    return postfix_lst
};


// 12+3
console.log(infix_exp_2_postfix_exp(["12", "+", "3"]))
// 2-3+2
console.log(infix_exp_2_postfix_exp(["2", "-", "3", "+", "2"]))
// (1+(4+5+3)-3)+(9+8)
var exp = ["(", "1", "+", "(", "4", "+", "5", "+", "3", ")", "-", "3", ")", "+", "(", "9", "+", "8", ")"];
console.log(infix_exp_2_postfix_exp(exp))

// (1+(4+5+3)/4-3)+(6+8)*3
var exp = ['(', '1', '+', '(', '4', '+', '5', '+', '3', ')', '/', '4', '-', '3', ')', '+', '(', '6', '+', '8', ')', '*', '3']
console.log(infix_exp_2_postfix_exp(exp))

console.log(infix_exp_2_postfix_exp(["12", "+", "3", "*", "5"]))
console.log(infix_exp_2_postfix_exp(["12", "*", "3", "+", "5"]))
console.log(infix_exp_2_postfix_exp(["(", "1", "+", "2", ")", "*", "(", "1", "+", "6", ")"]))


console.log(infix_exp_2_postfix_exp(["1", "+", "(", "12", "+", "3", "*", "5", ")"]))

// function ming(exp) {
//     var stack = new Stack.Stack();
//     exp.map((val,index) => {
//         if (Number(val)) {
//             stack.push(val)
//         } else if (['+','-','*'].includes(val) && exp(index+1)!='(') {
//             stack.push(val)
//         } else if (['+', '-', '*'].includes(val) && exp(index + 1) === '(') {

//         }
//     });
// }
// 思路：对改数组遍历，如果出现了符号并且是下一个就是'('，标志位+1，遇到')'才-1，直到为0，此时将符号push进栈。
// 问题： 不能使用map遍历，因为map只能遍历一层，此方法时间复杂度比较高，不推荐，并且没有考虑到优先级问题，优先级是存在一个隐形()，遇到高优先级的应该再弹一个符号出来
// Number(null)
// 0
// Number(undefined)
// NaN