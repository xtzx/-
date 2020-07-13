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
                        callback(self.value)
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


MyPromise.prototype.then = function (onFulfilled, onRejected) {
    //健壮性处理，处理点击穿透
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled :  (value) => { return value };
    onRejected = typeof onRejected === 'function' ? onRejected : r => { throw r }

    let that = this;
    const { status, value } = that;
    // let newPromise;


    // 其一 2.2.4规范 要确保 onFulfilled 和 onRejected 方法异步执行(且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行)
    // 所以要在resolve里加上setTimeout

    // 其二 2.2.6规范 对于一个promise，它的then方法可以调用多次.
    // （当在其他程序中多次调用同一个promise的then时 由于之前状态已经为FULFILLED/REJECTED状态，则会走的下面逻辑),
    // 所以要确保为FULFILLED/REJECTED状态后 也要异步执行onFulfilled/onRejected

    // 其二 2.2.6规范 也是resolve函数里加setTimeout的原因
    // 总之都是 让then方法异步执行 也就是确保onFulfilled/onRejected异步执行

    if (status === FULFILLED) {
        return new Promise((reslove, reject) => {
            setTimeout(
                () => {
                    try {
                        let x = onFulfilled(value);
                        reslove(x);
                    } catch (e) {
                        reject(e);
                    }
                }
            )
        })
    }

    if (status === REJECTED) {
        return new Promise((reslove, reject) => {
            setTimeout(
                () => {
                    try {
                        let x = onRejected(value);
                        reject(x);
                    } catch (e) {
                        reject(e);
                    }
                }
            )
        })
    }

    // 为等待态，不确定 下一个状态，将onFulfilled /onRejected 全部收集暂存
    if (status === PENDING) {
        return new Promise((reslove, reject) => {
            that.onFulfilledCallback.push(value => {
                try {
                    let x = onFulfilled(value);
                    reslove(x);
                } catch (e) {
                    reject(e);
                }
            });
            this.onRejectedCallback.push(reason => {
                try {
                    let x = onRejected(value);
                    reject(x);
                } catch (e) {
                    reject(e);
                }
            })

        })
    }
}

var P1 = new MyPromise((reslove, reject) => {
    reslove('点透')
});
P1.then(res => {
    return res;
})
    .then()
    .then(res => {
        console.log('点透', res)
    })


