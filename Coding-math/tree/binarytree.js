/**
 * 二叉树的类定义
 */
const Stack = require('./stack');
const Queue = require('./queue');

// 定义节点
var BinTreeNode = function (data) {
    this.data = data;
    this.leftChild = null; // 左孩子
    this.rightChild = null; // 右孩子
    this.parentNode = null; // 父节点
};

// 定义二叉树类


function BinaryTree() {
    var root = null; //根节点

    /**
     * 采用广义表表示的建立二叉树方法 A(B(D, E(G, )), C(, F))#
     * 遇到左括号的时候， 说明前面有一个节点， 这个括号里的两个节点都是它的子节点
     * 但是子节点后面还会有子节点， 因此， 我们需要一个先进后出的数据结构， 把前面的节点保存下来
     * 这样， 栈顶就是当前要处理的两个节点的父节点。
     * 
     * 逗号分隔了左右子树， 因此需要一个变量来标识遇到的是左子树还是右子树
     * 假设这个变量为k， 遇到左括号的时候， k = 1， 表示开始识别左子树
     * 遇到逗号， k = 2 表示开始识别右子树。
     * 
     * 遇到右括号， 说明一棵子树结束了
     * 那么栈顶的元素正是这棵子树的根节点， 执行pop方法出栈。
     */

    /**
     * 思路理解
     * 栈只是一个暂存区，不是最终输出的集合
     * 最终只是构建了一个🌲，保存了对应的节点顺序关系
     * 其中，是父节点的节点会被存在栈中
     * 遇到左右节点分别通过一个k值来识别
     * 当这个父节点的孩子都确定的时候
     * 通过)来弹出
     * (父节点入栈，)父节点出栈
     */
    this.init_tree = function (string) {
        var stack = new Stack.Stack();
        var k = 0;
        var new_node = null;
        for (var i = 0; i < string.length; i++) {
            var item = string[i];
            if (item == "#") {
                break;
            }
            if (item == "(") {
                stack.push(new_node);
                k = 1;
            } else if (item == ")") {
                stack.pop();
            } else if (item == ",") {
                k = 2;
            } else {
                new_node = new BinTreeNode(item);
                if (root == null) {
                    root = new_node;
                } else if (k == 1) {
                    // 左子树
                    var top_item = stack.top();
                    top_item.leftChild = new_node;
                    new_node.parentNode = top_item;
                } else {
                    // 右子树
                    var top_item = stack.top();
                    top_item.rightChild = new_node;
                    new_node.parentNode = top_item;
                }
            }
        }
    };

    this.get_root = function () {
        return root;
    };

    // 中序遍历， 前序遍历， 后序遍历， 都可以借助递归轻松解决， 递归的精髓在于甩锅

    // 中序遍历
    this.in_order = function (node) {
        if (node == null) {
            return;
        }
        this.in_order(node.leftChild);
        console.log(node.data);
        this.in_order(node.rightChild);
    };

    // 前序遍历
    this.pre_order = function (node) {
        if (node == null) {
            return;
        }
        console.log(node.data);
        this.pre_order(node.leftChild);
        this.pre_order(node.rightChild);
    };

    // 后序遍历
    this.post_order = function (node) {
        if (node == null) {
            return;
        }
        this.post_order(node.leftChild);
        this.post_order(node.rightChild);
        console.log(node.data);
    };


    // 获取全部节点数量，一个递归获取左边全部，一个递归获取右边全部
    var tree_node_count = function (node) {
        if (!node) {
            return 0;
        }
        // 左子树的节点数量加上右子树的节点数量 再加上1
        // 注意是用变量接收返回值
        var left_node_count = tree_node_count(node.leftChild);
        var right_node_count = tree_node_count(node.rightChild);
        return left_node_count + right_node_count + 1;
    };
    // 返回节点数量
    this.size = function () {
        return tree_node_count(root);
    };

    var tree_height = function (node) {
        // 左子树的高度和右子树的高度取最大值,加上当前的高度
        if (!node) {
            return 0;
        }

        var left_child_height = tree_height(node.leftChild);
        var right_child_height = tree_height(node.rightChild);
        if (left_child_height > right_child_height) {
            return left_child_height + 1;
        } else {
            return right_child_height + 1;
        }

    };
    // 返回高度
    this.height = function () {
        return tree_height(root);
    };

    // 查找节点
    /**
     * 递归查找
     * 先一路左节点到头
     * 然后退一级找右节点
     * 然后右节点的左节点一路到头
     */
    var find_node = function (node, data) {
        if (!node) {
            return null;
        }
        if (node.data == data) {
            return node;
        }

        left_res = find_node(node.leftChild, data);
        if (left_res) {
            return left_res;
        }

        return find_node(node.rightChild, data);
    };
    // 查找data
    this.find = function (data) {
        return find_node(root, data);
    };


};


exports.BinaryTree = BinaryTree;