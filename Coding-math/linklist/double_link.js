/**
 * 实现双向链表（ 地狱模式）
 * 和单链表不同的是， 双向链表的每个节点多出来一个pre指针域， 指向它的前驱节点。
 */




function DoubleLinkList() {
    // 定义节点
    var Node = function (data) {
        this.data = data; // 数据
        this.next = null; // 后继指针
        this.pre = null; // 前驱指针
    }

    var length = 0; // 长度
    var head = null; // 头节点
    var tail = null; // 尾节点

    // append方法
    this.append = function (data) {
        var new_node = new Node(data);
        if (!head) {
            head = new_node;
            tail = new_node;
        } else {
            tail.next = new_node;
            new_node.pre = tail;
            tail = new_node;
        }

        length += 1; // 长度加1
        return true;
    };

    // 获得指定位置的节点
    var get_node = function (index) {
        if (index < 0 || index >= length) {
            return null;
        }
        var curr_node = head;
        var node_index = index;
        while (node_index-- > 0) {
            curr_node = curr_node.next;
        }
        return curr_node;
    };

    // 插入方法
    this.insert = function (index, data) {
        if (index == length) {
            return this.append(data);
        } else if (index > length || index < 0) {
            // index范围错误
            return false;
        } else {
            var new_node = new Node(data);
            if (index == 0) {
                new_node.next = head;
                head.pre = new_node
                head = new_node;
            } else {
                var pre_node = get_node(index - 1);
                new_node.next = pre_node.next;
                new_node.next.pre = new_node;
                pre_node.next = new_node;
                new_node.pre = pre_node;
            }
            length += 1;
            return true;
        }
    };


    this.remove = function (index) {
        if (index < 0 || index >= length) {
            return null;
        } else {
            var del_node = null;
            // 删除的是头节点
            if (index == 0) {
                // head指向下一个节点
                del_node = head;
                head = head.next;
                // 如果head == null,说明之前链表只有一个节点
                if (!head) {
                    tail = null;
                } else {
                    head.pre = null;
                }

            } else {
                var pre_node = get_node(index - 1);
                del_node = pre_node.next;
                if (del_node.next == null) {
                    pre_node.next = null;
                    tail = pre_node;
                } else {
                    pre_node.next = del_node.next;
                    del_node.next.pre = pre_node;
                }
            }

            length -= 1;
            return del_node.data;
        }
    };


    // 输出链表
    this.print = function () {
        var curr_node = head;
        var str_link = ""
        while (curr_node) {

            str_link += curr_node.data.toString() + " ->";
            curr_node = curr_node.next;
        }
        str_link += "null";
        console.log(str_link);
        console.log("长度为" + length.toString());
    };

};

var double_link = new DoubleLinkList();
double_link.append(1);
double_link.append(2);
double_link.print();
double_link.insert(0, 9);
double_link.insert(3, 10);
double_link.print();
double_link.remove(0);
double_link.print();
double_link.remove(2);
double_link.print();