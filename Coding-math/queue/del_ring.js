/**
 * 约瑟夫环
 * 有一个数组a[1000]存放0--1000;要求每隔二个数删掉一个数，
 * 到末尾时循环至开头继续进行，求最后一个被删掉的数的原始下标位置
 */

Queue = require('./myqueue')

function del_ring(arr_list) {

    var queue = new Queue.Queue();

    for (var i = 0; i < arr_list.length; i++) {
        queue.enqueue(arr_list[i]); // 把数组里的元素都放入到队列中
    }

    var index = 0;

    while (queue.size() != 1) {
        var item = queue.dequeue(); // 弹出一个元素,判断是否需要删除
        index += 1;
        if (index % 3 != 0) { // 每隔两个就要删除掉一个,那么不是被删除的元素就放回到队列尾部
            queue.enqueue(item);
        }
    }

    return queue.head();
};


var arr_list = [];
for (var i = 0; i < 3; i++) {
    arr_list.push(i);
}


console.log(del_ring(arr_list));