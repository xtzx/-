// 定义三个状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
// 简单的 Promise 构造函数

function MyPromise (handler) {
    let self = this;
    // 初始状态
    self.status = PENDING;
    // 初始值
    self.value = undefined;
    self.reason = '';

    self.onFulfilledCallback = [];
    self.onRejectedCallback = [];

    reslove = value => {
        setTimeout(
            () => {
                if (self.status === PENDING) {
                    self.value = value;
                    self.status = FULFILLED;
                    self.onFulfilledCallback.forEach(callback => {
                        callback(self.value )
                    });
                }
            }, 0
        )
    }

    reject = value => {
        setTimeout(
            () => {
                if (self.status === PENDING) {
                    self.reason = value;
                    self.status = REJECTED;
                    self.onRejectedCallback.forEach(callback => {
                        callback(self.reason)
                    });
                }
            }, 0
        )
    }

    try {
        handler(reslove, reject)
    } catch (e) {
        reject(e);
    }
}

// 接收两个参数

MyPromise.prototype.then = function(onFulfilled, onRejected) {
    //健壮性处理，处理点击穿透
    // onResolved = typeof onResolved === 'function' ? onResolved : v => {return v}
    // onRejected = typeof onRejected === 'function' ? onRejected : r => {throw r}
    this.onRejectedCallback.push(onRejected);
    this.onFulfilledCallback.push(onFulfilled);
}


var P1 = new MyPromise((reslove, reject) => {
    reslove('基础测试')
});
P1.then(
    res => {
        console.log("1111", res);
        P1.then(
            res => {
                console.log('基础测试', res);
            }
        )
    }
)


// 结果  1111 基础测试