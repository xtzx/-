function insertionSort(myArray) {

    var len = myArray.length, // 数组的长度
        value, // 当前比较的值
        i, // 未排序部分的当前位置
        j; // 已排序部分的当前位置

    for (i = 0; i < len; i++) {

        value = myArray[i]; // 储存当前位置的值

        /*
         * 当已排序部分的当前元素大于value，
         * 就将当前元素向后移一位，再将前一位与value比较
         */
        for (j = i - 1; j > -1 && myArray[j] > value; j--) {
            myArray[j + 1] = myArray[j];
        }

        myArray[j + 1] = value;
    }

    return myArray;
}

console.log(insertionSort([43, 5, 57, 990, 23, 1, 46, 86, 9, 5, 24, 0]));



/**
 * 思路
 * 插入排序
 * 从第i个元素开始
 * 前面的已经排序好
 * 将i和i-1的值比较，如果i-1是大于i的话，将i-1向后复制一位
 */
function insertionSort2(myArray) {

    var len = myArray.length,
        value, i, j;

    for (i = 1; i < len; i++) { // 此处可以为0或者1
        value = myArray[i];

        for (j = i - 1; j > -1 && myArray[j] > value; j--) { // 注意此处是value而不是myArray[i],因为值在变化
            myArray[j + 1] = myArray[j]
        }
        myArray[j + 1] = value;

    }
    return myArray;
}