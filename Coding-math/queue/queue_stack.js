/**
 * 用两个队列实现一个栈,检验的是对栈与队列的理解
 */

Queue = require('./myqueue')

// 队列是先进先出， 而栈是先进后出， 两者对数据的管理模式刚好是相反的， 但是却可以用两个队列实现一个栈。
// 两个队列分别命名为queue_1, queue_2, 实现的思路如下:
// push， 实现push方法时， 如果两个队列都为空那么默认向queue_1里添加数据， 如果有一个不为空则向这个不为空的队列里添加数据
// top， 两个队列， 或者都为空， 或者有一个不为空， 只需要返回不为空的队列的尾部元素即可
// pop， pop方法是比较复杂， pop方法要删除的是栈顶， 但这个栈顶元素其实是队列的尾部元素。 
// 每一次做pop操作时， 将不为空的队列里的元素一次删除并放入到另一个队列中直到遇到队列中只剩下一个元素
// 删除这个元素， 其余的元素都跑到之前为空的队列中了。
// 在具体的实现中， 我定义额外的两个变量， data_queue和empty_queue， data_queue始终指向那个不为空的队列， empty_queue始终指向那个为空的队列。

function QueueStack() {
    var queue_1 = new Queue.Queue();
    var queue_2 = new Queue.Queue();
    var data_queue = null; // 放数据的队列
    var empty_queue = null; // 空队列,备份使用

    // 确认哪个队列放数据,哪个队列做备份空队列
    var init_queue = function () {
        // 都为空,默认返回queue_1
        if (queue_1.isEmpty() && queue_2.isEmpty()) {
            data_queue = queue_1;
            empty_queue = queue_2;
        } else if (queue_1.isEmpty()) {
            data_queue = queue_2;
            empty_queue = queue_1;
        } else {
            data_queue = queue_1;
            empty_queue = queue_2;
        }
    };


    // push方法
    this.push = function (item) {
        init_queue();
        data_queue.enqueue(item);
    };

    // top方法
    this.top = function () {
        init_queue();
        return data_queue.tail();
    }

    /**
     * pop方法要弹出栈顶元素,这个栈顶元素,其实就是queue的队尾元素
     * 但是队尾元素是不能删除的,我们可以把data_queue里的元素(除了队尾元素)都移除放入到empty_queue中
     * 最后移除data_queue的队尾元素并返回
     * data_queue 和 empty_queue 交换了身份
     */
    this.pop = function () {
        init_queue();
        while (data_queue.size() > 1) {
            empty_queue.enqueue(data_queue.dequeue());
        }
        return data_queue.dequeue();
    };
};


var q_stack = new QueueStack();
q_stack.push(1);
q_stack.push(2);
q_stack.push(4);
console.log(q_stack.top()); // 栈顶是 4
console.log(q_stack.pop()); // 移除 4
console.log(q_stack.top()); // 栈顶变成 2
console.log(q_stack.pop()); // 移除 2
console.log(q_stack.pop()); // 移除 1