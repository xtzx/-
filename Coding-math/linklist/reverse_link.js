/**
 * 翻转链表
 * 使用迭代和递归两种方法翻转链表
 * 下面的代码已经准备好了上下文环境
 * 请实现函数reverse_iter和reverse_digui。
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

function print(node) {
    var curr_node = node;
    while (curr_node) {
        console.log(curr_node.data);
        curr_node = curr_node.next;
    }
};




// 迭代翻转
/**
 * 在考虑算法时， 多数情况下你考虑边界情况会让问题变得简单， 但边界情况往往不具备普适性
 * 因此， 也要尝试考虑中间的情况
 * 假设链表中间的某个点为curr_node， 它的前一个节点是pre_node, 后一个节点是next_node
 * 现在把思路聚焦到这个curr_node节点上， 只考虑在这一个点上进行翻转
 * 在遍历的过程中， 每完成一个节点的翻转， 都让curr_node = next_node, 找到下一个需要翻转的节点
 * 同时， pre_node和next_node也跟随curr_node一起向后滑动。
 */
function reverse_iter(head) {
    if (!head) {
        return null;
    }
    var pre_node = null; // 前一个节点
    var curr_node = head; // 当前要翻转的节点
    while (curr_node) {
        var next_node = curr_node.next; // 下一个节点
        curr_node.next = pre_node; // 对当前节点进行翻转
        pre_node = curr_node; // pre_node向后滑动
        curr_node = next_node; // curr_node向后滑动
    }
    //最后要返回pre_node,当循环结束时,pre_node指向翻转前链表的最后一个节点
    return pre_node;
};




// 递归翻转???
function reverse_digui(head) {
    // 如果head 为null
    if (!head) {
        return null;
    }

    if (head.next == null) {
        return head;
    }
    // 从下一个节点开始进行翻转
    var new_head = reverse_digui(head.next);
    head.next.next = head; // 把当前节点连接到新链表上
    head.next = null;
    return new_head;
};

print(reverse_digui(node1));


// 递归的思想， 精髓之处在于甩锅， 你做不到的事情， 让别人去做， 等别人做完了， 你在别人的基础上继续做。

// 甩锅一共分为四步：

// 1 明确函数的功能， 既然是先让别人去做， 那你得清楚的告诉他做什么。 
// 函数reverse_digui(head) 完成的功能， 是从head开始翻转链表， 函数返回值是翻转后的头节点

// 2 正式甩锅， 进行递归调用， 就翻转链表而言， 甩锅的方法如下 var new_head = reverse_digui(head.next);
// 原本是翻转以head开头的链表， 可是你不会啊， 那就先让别人从head.next开始翻转链表， 等他翻转完， 得到的new_head就是翻转后的头节点。

// 3 根据别人的结果， 计算自己的结果
// 第二步中， 已经完成了从head.next开始翻转链表， 现在， 只需要把head连接到新链表上就可以了
// 新链表的尾节点是head.next， 执行head.next.next = head， 这样， head就成了新链表的尾节点。

// 4 找到递归的终止条件
// 递归必须有终止条件， 否则， 就会进入到死循环， 函数最终要返回新链表的头， 而新链表的头正式旧链表的尾
// 所以， 遇到尾节点时， 直接返回尾节点， 这就是递归终止的条件。