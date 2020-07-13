/**
 * 用队列输出杨辉三角的前n行 n >= 1
 */

Queue = require('./myqueue')

// 杨辉三角中的每一行， 都依赖于上一行， 假设在队列里存储第n - 1 行的数据
// 输出第n行时， 只需要将队列里的数据依次出队列， 进行计算得到下一行的数值并将计算所得放入到队列中。
// 计算的方式： f[i][j] = f[i - 1][j - 1] + f[i - 1][j], i 代表行数， j代表一行的第几个数， 如果j = 0 或者 j = i, 则 f[i][j] = 1。
// 但是将计算所得放入到队列中时， 队列中保存的是两行数据， 一部分是第n - 1 行， 另一部分是刚刚计算出来的第n行数据， 需要有办法将这两行数据分割开。
// 分开的方式有两种， 一种是使用for循环进行控制， 在输出第5行时， 其实只有5个数据可以输出
// 那么就可以使用for循环控制调用enqueue的次数， 循环5次后， 队列里存储的就是计算好的第6行的数据。
// 第二种方法是每一行的数据后面多存储一个0， 使用这个0来作为分界点， 如果enqueue返回的是0， 就说明这一行已经全部输出， 此时， 将这个0追加到队列的末尾。

function print_yanghui(n) {
    var queue = new Queue.Queue();
    queue.enqueue(1);
    // 第一层for循环控制打印几层
    for (var i = 1; i <= n; i++) {
        var line = "";
        var pre = 0;
        // 第二层for循环控制打印第 i 层
        for (var j = 0; j < i; j++) {
            var item = queue.dequeue();
            line += item + "  "
            // 计算下一行的内容
            var value = item + pre;
            pre = item;
            queue.enqueue(value);
        }
        // 每一层最后一个数字是1,上面的for循环没有计算最后一个数
        queue.enqueue(1);
        console.log(line);
    }
};

function print_yanghui_2(n) {
    var queue = new Queue.Queue();
    queue.enqueue(1);
    queue.enqueue(0);
    for (var i = 1; i <= n; i++) {
        var line = "";
        var pre = 0;
        while (true) {
            var item = queue.dequeue();
            // 用一个0把每一行的数据分割开,遇到0不输出,
            if (item == 0) {
                queue.enqueue(1);
                queue.enqueue(0);
                break
            } else {
                // 计算下一行的内容
                line += item + "  "
                var value = item + pre;
                pre = item;
                queue.enqueue(value);
            }
        }
        console.log(line);
    }
}


print_yanghui(4);
//print_yanghui_2(10);