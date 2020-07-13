/**
 * Created by kwsy on 2018/9/2.
 * 实现一个栈， 除了常见的push， pop方法以外， 提供一个min方法， 返回栈里最小的元素， 且时间复杂度为o(1)
 */

Stack = require('./mystack.js')

function MinStack() {
    var data_stack = new Stack.Stack(); // 存储数据
    var min_stack = new Stack.Stack(); // 存储最小值

    this.push = function (item) {
        data_stack.push(item);

        // min_stack为空或者栈顶元素大于item
        if (min_stack.isEmpty() || item < min_stack.top()) {
            min_stack.push(item);
        } else {
            min_stack.push(min_stack.top()); // min_stack的元素个数要和data_stack 保持一致
        }

    };

    this.pop = function () {
        data_stack.pop();
        min_stack.pop();
    };

    this.min = function () {
        return min_stack.top();
    };
};


minstack = new MinStack();

//minstack.push(3);
//minstack.push(6);
//minstack.push(8);
//console.log(minstack.min());
//minstack.push(2);
//console.log(minstack.min());
//minstack.pop();
//console.log(minstack.min());

minstack.push(1);
minstack.push(2);
minstack.push(3);
console.log(minstack.min());
minstack.pop();
console.log(minstack.min());
minstack.pop();
console.log(minstack.min());