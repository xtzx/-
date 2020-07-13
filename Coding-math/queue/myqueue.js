/**
 * 定义一个队列
 */

//  enqueue 从队列尾部添加一个元素（ 新来一个排队的人， 文明礼貌， 站在了队伍末尾）
//  dequeue 从队列头部删除一个元素（ 排队伍最前面的人刚办理完登机手续， 离开了队伍）
//  head 返回头部的元素， 注意， 不是删除（ 只是看一下， 谁排在最前面）
//  size 返回队列大小（ 数一数有多少人在排队）
//  clear 清空队列（ 航班取消， 大家都散了吧）
//  isEmpty 判断队列是否为空（ 看看是不是有人在排队）
//  tail 返回队列尾节点

function Queue() {
    var items = []; // 存储数据

    // 向队列尾部添加一个元素
    this.enqueue = function (item) {
        items.push(item);
    };

    // 移除队列头部的元素
    this.dequeue = function () {
        return items.shift();
    };

    // 返回队列头部的元素
    this.head = function () {
        return items[0];
    };

    // 返回队列尾部的元素
    this.tail = function () {
        return items[items.length - 1];
    };

    // 返回队列大小
    this.size = function () {
        return items.length;
    };

    // clear
    this.clear = function () {
        items = [];
    };

    // isEmpty 判断是否为空队列
    this.isEmpty = function () {
        return items.length == 0;
    };
};



exports.Queue = Queue;