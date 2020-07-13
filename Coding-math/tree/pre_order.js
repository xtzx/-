/**
 * 非递归实现前序遍历
 * 
 * 递归转为非递归， 要使用while循环。
 * 前序遍历， 先处理当前节点, curr_node， 然后处理curr_node.leftChild
 * 最后处理curr_node.rightChild
 * 那么在while循环里， 让curr_node = curr_node.leftChild， 就可以实现对左子树访问处理
 * 但问题在于访问处理左子树结束之后， 要找到对应右子树
 * 因此需要一个数据结构， 能够在左子树访问结束后返回这棵左子树对应的右子树
 * 前面学过的栈， 恰好可以实现这样的功能
 */

const BinaryTree = require('./binarytree')
const Stack = require('./stack');

var bt = new BinaryTree.BinaryTree();
bt.init_tree("A(B(D,E(G,)),C(,F))#");
var root_node = bt.get_root();





function pre_order(node) {
    var stack = new Stack.Stack();
    var curr_node = node;

    while (curr_node) {
        console.log(curr_node.data);
        if (curr_node.rightChild) {
            stack.push(curr_node.rightChild);
        }

        if (curr_node.leftChild) {
            curr_node = curr_node.leftChild;
        } else {
            curr_node = stack.pop();
        }
    }
};


pre_order(root_node);