/**
 * 查找单链表的中间结点（ 普通模式）
 */

var Node = function (data) {
    this.data = data;
    this.next = null;
};

var node1 = new Node(1);
var node2 = new Node(2);
var node3 = new Node(3);
var node4 = new Node(4);
var node5 = new Node(5);


node1.next = node2;
node2.next = node3;
node3.next = node4;
node4.next = node5;






// 两个一起走,fast一次走两步,slow一次走一步
function find_middle(head) {
    var fast = head;
    var slow = head;

    while (fast.next) { // 注意此处是.next,如果只是fast，当fast.next为null的时候，走两步会报错
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow.data;
};

console.log(find_middle(node1));