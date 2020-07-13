/**
 * 合并两个有序链表
 */

// 已知有两个有序链表(链表元素从小到大)，请实现函数merge_link
// 将两个链表合并成一个有序链表，并返回新链表，原有的两个链表不要修改。

var Node = function (data) {
    this.data = data;
    this.next = null;
}

var node1 = new Node(1);
var node2 = new Node(4);
var node3 = new Node(9);
var node4 = new Node(2);
var node5 = new Node(5);
var node6 = new Node(6);
var node7 = new Node(10);


node1.next = node2;
node2.next = node3;

node4.next = node5;
node5.next = node6;
node6.next = node7;


/**
 * 合并两个有序链表， 是归并排序在链表上的一种实践
 * 对两个链表， 各自设置一个游标节点指向头节点， 对游标节点上的数值进行比较
 * 数值小的那个拿出来放入到合并链表中， 同时游标节点向后滑动， 继续比较游标节点数值大小。
 * 为了实现滑动， 需要使用一个while循环， 当其中一个游标节点为null时， 循环终止
 * 这时， 可能另一个游标节点还没有到达尾节点， 那么把这段还没有遍历结束的链表添加到合并列表上。
 */



function merge_link(head1, head2) {
    if (head1 == null) {
        return head2;
    } else if (head2 == null) {
        return head1;
    }

    var merge_head = null; // 合并后链表头
    var merge_tail = null; // 合并后链表尾
    var curr_1 = head1;
    var curr_2 = head2;
    while (curr_1 && curr_2) {
        // 找到最小值
        var min_data;
        if (curr_1.data < curr_2.data) {
            min_data = curr_1.data;
            curr_1 = curr_1.next;
        } else {
            min_data = curr_2.data;
            curr_2 = curr_2.next;
        }

        if (merge_head == null) {
            merge_head = new Node(min_data);
            merge_tail = merge_head;
        } else {
            var new_node = new Node(min_data);
            // 把new_node连接到合并链表
            merge_tail.next = new_node;
            // 尾节点指向新创建的节点
            merge_tail = new_node;
        }

    }

    // 链表可能还有一部分没有合并进来
    var rest_link = null;
    if (curr_1) {
        rest_link = curr_1;
    }
    if (curr_2) {
        rest_link = curr_2;
    }

    while (rest_link) {
        var new_node = new Node(rest_link.data);
        merge_tail.next = new_node;
        merge_tail = new_node;
        rest_link = rest_link.next;
    }
    return merge_head;
};

print(merge_link(node1, node4));

function print(node) {
    var curr_node = node;
    while (curr_node) {
        console.log(curr_node.data);
        curr_node = curr_node.next;
    }
};