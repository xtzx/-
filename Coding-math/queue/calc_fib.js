/**
 * 用队列来计算斐波那契
 */

//  斐波那契数列的前两项是 1 1， 此后的每一项都是该项前面两项之和， 即f(n) = f(n - 1) + f(n - 2)。
//  如果使用数组来实现， 究竟有多麻烦了我就不赘述了， 直接考虑使用队列来实现。
//  先将两个1 添加到队列中， 之后使用while循环， 用index计数， 循环终止的条件是index < n - 2
//  使用dequeue方法从队列头部删除一个元素， 该元素为del_item
//  使用head方法获得队列头部的元素， 该元素为 head_item
//  del_item + head_item = next_item, 将next_item放入队列， 注意， 只能从尾部添加元素
//  index + 1
//  当循环结束时， 队列里面有两个元素， 先用dequeue 删除头部元素， 剩下的那个元素就是我们想要的答案

Queue = require('./myqueue')

function fibonacci(n) {
    queue = new Queue.Queue();
    var index = 0;

    // 先放入斐波那契序列的前两个数值
    queue.enqueue(1);
    queue.enqueue(1);

    while (index < n - 2) {
        var del_item = queue.dequeue();
        var head_item = queue.head();
        var next_item = del_item + head_item;
        queue.enqueue(next_item);
        index += 1;
    }

    queue.dequeue();
    return queue.head();
};


console.log(fibonacci(8));