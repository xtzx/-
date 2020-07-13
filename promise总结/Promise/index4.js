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
        if (value instanceof Promise) {
            return value.then(resolve, reject);
        }

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


/**
 * 对resolve 进行改造增强 针对resolve中不同值情况 进行处理
 * @param {Promise} promise2 promise1.then 方法中返回的新对象
 * @param {[type]} x promise1中 onFulfilled 的返回值
 * @param {*} reslove promise2 的 reslove
 * @param {*} reject promise2 的 reject
 */
function reslovePromise (promise2, x, reslove, reject) {
    // x 与 promise 相等；如果 promise 和 x 指向同一对象
    if (promise2 === x) {
        throw new Error('循环引用')
    }
    // 避免多次调用
    let called = false;

    if (x instanceof Promise) {
        // 如果x的状态还没有确定，那么它是有可能被一个thenable决定最终状态和值的
        // 所以这里需要做一下处理，而不能一概的以为它会被一个“正常”的值resolve
        if (x.status === PENDING) {
            x.then(y => {
                reslovePromise(promise2, y, reslove, reject);
            }, reason => {
                reject(reason);
            })
        }
        else {
            // 如果 x 已经处于执行态/拒绝态(值已经被解析为普通值)，用相同的值执行传递下去 promise
            x.then(reslove, reject);
        }
    }
    else if (x !== null && ((typeof x === 'object') || (typeof x === 'function'))) {
        try {
            // 因为x.then有可能是一个getter，这种情况下多次读取就有可能产生副作用
            // 即要判断它的类型，又要调用它，这就是两次读取, 兼容  更多的Promise
            const then = x.then;
            console.log(x, then);
            if (typeof then === 'function') {
                console.log('called---false', x, then);
                then.call(x, y => {
                    console.log('called---false---00');
                    if (called) return;
                    called = true;
                    reslovePromise(promise2, y, reslove, reject);
                }, reason => {
                    if (called) return;
                    called = true;
                    reject(reason);
                })
            }
        } catch (e) {
            resolve(x);
        }
    }
    else {
        reslove(x);
    }

}

// 接收两个参数
MyPromise.prototype.then = function (onFulfilled, onRejected) {
    //健壮性处理，处理点击穿透
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => { return value };
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
        return promise2 = new Promise((reslove, reject) => {
            setTimeout(
                () => {
                    try {
                        let x = onFulfilled(value);
                        reslovePromise(promise2, x, reslove, reject);
                    } catch (e) {
                        reject(e);
                    }
                }
            )
        })
    }

    if (status === REJECTED) {
        return promise2 = new Promise((reslove, reject) => {
            setTimeout(
                () => {
                    try {
                        let x = onRejected(value);
                        reslovePromise(promise2, x, reslove, reject);
                    } catch (e) {
                        reject(e);
                    }
                }
            )
        })
    }

    // 为等待态，不确定 下一个状态，将onFulfilled /onRejected 全部收集暂存
    if (status === PENDING) {
        return promise2 = new Promise((reslove, reject) => {
            that.onFulfilledCallback.push(value => {
                try {
                    let x = onFulfilled(value);
                    reslovePromise(promise2, x, reslove, reject);
                } catch (e) {
                    reject(e);
                }
            });
            this.onRejectedCallback.push(reason => {
                try {
                    let x = onRejected(value);
                    reslovePromise(promise2, x, reslove, reject);
                } catch (e) {
                    reject(e);
                }
            })

        })
    }
}

//
MyPromise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
}

/**
 * Promise.all Promise进行并行处理
 * 参数: promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 当这个数组里的所有promise对象全部变为resolve状态的时候，才会resolve。
 */
Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        const length = promises.length;
        let count = 0;
        let resolvedValues = [];
        promises.forEach((promise, i) => {
            promise.then((value) => {
                resolvedValues[i] = value;
                if (++count === length) {
                    resolve(resolvedValues);
                }
            }, reject)
        })
    })
}


/**
 * Promise.race
 * 参数: 接收 promise对象组成的数组作为参数
 * 返回值: 返回一个Promise实例
 * 只要有一个promise对象进入 FulFilled 或者 Rejected 状态的话，就会继续进行后面的处理(取决于哪一个更快)
 */
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        promises.forEach((promise, index) => {
            promise.then(resolve, reject);
        });
    });
}



var P2 = new MyPromise((reslove, reject) => {
    reslove('P2');
})

var P1 = new MyPromise((reslove, reject) => {
    reslove('P1')
});

// var obj = {
//     then(reslove,reject) {
//         console.log('00000');
//         return reslove('obj-then')
//     }
// }

// P1.then(
//     res => {
//         console.log('p1-onFulfilled-reslove',res)
//         return 'name';
//     }
// ).then(
//     res=> {
//         console.log('p1--l连then', res);
//     }
// )

Promise.all([P1, P2])
    .then(([p1, p2]) => console.log(p1, p2))
    .catch(e => console.log(e));