/**
 * Created by kwsy on 2018/9/6.
 */

/**
 * 通过索引操作数据， 时间复杂度就是O(1)
 * 比如在数组中存0-100中若干个数，若不需要知道位置
 * 可以arr[3] = 1表示3有1个，若还有更多的3就一直++
 * 0表示没有，这样子很容易知道哪个值有几个
 * 时间复杂度是O(1)
 * 
 * 仅仅是8个bit位就能表示8栈路灯的亮灭情况， 那么一个整数有32个bit位， 就可以表示32栈路灯的亮灭情况
 * datas[0] 表示0~31 存在与否
 * datas[1] 表示32~63 存在与否
 *     ....
 * datas[9] 表示288~319 存在与否
 */




function BitMap(size) {
    var bit_arr = new Array(size);
    for (var i = 0; i < bit_arr.length; i++) {
        bit_arr[i] = 0;
    }

    this.addMember = function (member) {
        var arr_index = Math.floor(member / 32); // 决定在数组中的索引
        var bit_index = member % 32; // 决定在整数的32个bit位的哪一位上
        bit_arr[arr_index] = bit_arr[arr_index] | 1 << bit_index;
    };

    this.isExist = function (member) {
        var arr_index = Math.floor(member / 32); // 决定在数组中的索引
        var bit_index = member % 32; // 决定在整数的32个bit位的哪一位上
        var value = bit_arr[arr_index] & 1 << bit_index;
        if (value != 0) {
            return true;
        }
        return false;
    };
}

exports.BitMap = BitMap;