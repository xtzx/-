/**
 * 从尾到头打印链表
 */

var Node = function (data) {
    this.data = data;
    this.next = null;
}

var node1 = new Node(1);
var node2 = new Node(2);
var node3 = new Node(3);
var node4 = new Node(4);
var node5 = new Node(5);


node1.next = node2;
node2.next = node3;
node3.next = node4;
node4.next = node5;





// 当你拿到一个链表时，得到的是头节点，只有头结点以后的节点被打印了，才能打印头节点，这不正是一个可以甩锅的事情么,先定义函数
// function reverse_print(head) {
// };
// 函数的功能， 就是从head开始反向打印链表， 但是现在不知道该如何反向打印
// 于是甩锅， 先从head.next开始反向打印， 等这部分打印完了， 再打印head节点

/**
 * 理解
 * reverse_print(head.next) 一直从头节点执行到尾节点， 同时console.log(head.data)一直被卡住
 * 直到reverse_print停止，return出来，此时console.log才从内到外开始执行
 */
function reverse_print(head) {
    // 递归终止条件
    if (head == null) {
        return
    } else {
        reverse_print(head.next);
        console.log(head.data);
    }
};

reverse_print(node1);