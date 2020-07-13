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
                        callback(value)
                    });
                }
            }, 0
        )
    }

    reject = value => {
        setTimeout(
            () => {
                if (self.status === PENDING) {
                    self.value = value;
                    self.status = REJECTED;
                    self.onRejectedCallback.forEach(callback => {
                        callback(value)
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


MyPromise.prototype.then = (onFulfilled, onRejected) => {
    //健壮性处理，处理点击穿透
    onResolved = typeof onResolved === 'function' ? onResolved : v => {return v}
    onRejected = typeof onRejected === 'function' ? onRejected : r => {throw r}
    // 返回Promise  可以 链式使用
    return newPromise = new MyPromise((resolve, reject) => {
        const { value, status } = this;
        let fulfilled = setTimeout(() => {
            console.log('newPromise----');
            try {
                let x = onFulfilled(that.value);
                // 新的promise resolve 上一个onFulfilled的返回值
                resolvePromise(newPromise, x, resolve, reject);
            } catch (e) {
                // 捕获前面onFulfilled中抛出的异常 then(onFulfilled, onRejected);
                reject(e);
            }
        });

        let rejected = setTimeout(() => {
            try {
                let x = onRejected(that.value);
                // 新的promise resolve 上一个onFulfilled的返回值
                resolvePromise(newPromise, x, resolve, reject);
            } catch (e) {
                reject(e); // 捕获前面onFulfilled中抛出的异常 then(onFulfilled, onRejected);
            }
        });

        switch (status) {
            // 当状态为pending时，将then方法回调函数加入执行队列等待执行
            case PENDING:
                this.onFulfilledCallback.push(fulfilled)
                this.onRejectedCallback.push(rejected)
                break
            // 当状态已经改变时，立即执行对应的回调函数
            case FULFILLED:
                fulfilled(value)
                break
            case REJECTED:
                rejected(value)
                break

        }
    })
}

function resolvePromise (newPromise, x, resolve, reject) {
    if(newPromise === x) {
        throw new Error('循环引用');
    }

    let called = false;
    // 返回的结果是 Promise 对象
    if(x instanceof MyPromise) {
        if(x.status === PENDING) {
            // 需等待直至 x 被执行或拒绝 并解析y值
            x.then(y => {
                console.log('yyyyy:', y)
                resolvePromise(promise2, y, resolve, reject);
            }, reason => {
                reject(reason);
            })
        }
        else {
            x.then(resolve,reject)
        }
    }
    // 对象或者函数
    else if(x !== null && ((typeof x === 'object') || (typeof x === 'function'))){
        if(called) return;
        called = true;
        try {
            if( typeof x.then === 'function') {
                then.call(x, y=>{
                    resolvePromise(newPromise, y, reslove,reject)
                },reason => {
                    reject(reason);
                })
            }
            else {
                // 普通函数或者对象
                reslove(x);
            }

        }catch(e) {
            reject(e);
        }

    }
    else {
        reslove(x);
    }
}

// MyPromise.deferred = Promise.defer = function(){
//     var dfd = {}
//     dfd.promise = new MyPromise(function(resolve, reject) {
//       dfd.resolve = resolve;
//       dfd.reject = reject;
//     })
//     return dfd
//   }

