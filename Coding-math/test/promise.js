function Mypromise(fn) {
    this.state = 'pending';
    this.value = void 0;
    this.doneList = [];
    this.failList = [];
    // 在创建一个promise的时候，需要传递一个fn函数，接受参数resolve和reject。 
    // resolve和reject目前还没有定义，因为用户是直接调用的，如resolve('success')，所以这个resolve方法是需要我们自己来定义的。
    var self = this;

    function resolve(value) {
        // 一旦resolve，状态机的状态由pending -> resolved
        // 并且在resolve的时候状态必须是pending，才能转换状态。
        // 异步执行所有回调函数
        setTimeout(function () {
            if (self.state == 'pending') {
                self.state = 'resolved'
                self.value = value;
                // 一旦成功，我们就可以执行所有promise上挂载的 doneList 中所有的回调函数了，并将value值传递过去
                for (var i = 0; i < self.doneList.length; i++) {
                    self.doneList[i](value);
                }
            }
        }, 0);
    }

    function reject(reason) {
        // 一旦reject，状态机的状态由pending -> rejected
        // 在reject的时候状态必须是pending，才能转化状态。
        // 异步执行所有回调函数
        setTimeout(function () {
            if (self.state == 'pending') {
                self.state = 'rejected'
                self.value = reason;
                // 一旦失败，我么就可以把所有的 failList 调用了，并且传递 reason
                for (var i = 0; i < self.failList.length; i++) {
                    self.failList[i](reason);
                }
            }
        }, 0);
    }

    fn(resolve, reject);
}

Mypromise.prototype = {
    constructor: Mypromise,

    // then方法接受成功时的回调和失败时的回调
    // 实际上，这里的then方法就像路由中的注册路由一样，是一个注册的过程，而没有真正的调用。
    // 并且then是支持链式调用的，所以then应该返回一个promise。 如果返回旧的，那么因为状态不能改变，所以没有意义，所以我么一定要返回一个新的promise，这样这个状态机才可以再次正常的工作。
    then: function (onResolved, onRejected) {
        var self = this;

        // 对于then而言，最终要返回一个新的promise，这样才支持链式调用。
        var promise2;

        // 这里要做一个判断，看传递进来的是否是一个函数，如果是，则不变，如果不是，就拒绝。
        // 如果是promise.then().then().then(function (value) {}); 我们还希望拿到value，那么就要把value在即使没有用到onResolved的时候也传递下去。对于reason也是如此。
        onResolved = typeof onResolved == 'function' ? onResolved : function (value) {
            return value;
        }
        onRejected = typeof onRejected == 'function' ? onRejected : function (reason) {
            return reason;
        }



        // 下面这一部分是比较核心的内容，因为then最终要返回一个promise，但是，这个promise究竟应该怎么返回呢？ 如果在then中，用户就返回了promise，那么我们就用户的，如果用户用的不是promise，那么我么就要自己封装好这个promise了。 
        // 注意： promise也是需要异步调用的，所以可以使用promise进行封装。
        switch (this.state) {
            case 'resolved':
                // 如果resolved，则返回一个新的promise
                return promise2 = new Mypromise(function (resolve, reject) {
                    setTimeout(function () {
                        try {
                            // 这里相当于直接就给执行了，看看返回的是什么值，如果是promise,那么直接就使用这个promise了。 
                            var x = onResolved(self.value);
                            if (x instanceof Mypromise) {
                                x.then(resolve, reject);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    }, 0)
                })
            case 'rejected':
                // 如果rejected，同样也需要返回一个新的promise
                return promise2 = new Mypromise(function (resolve, reject) {
                    setTimeout(function () {
                        try {
                            var x = onRejected(self.value);
                            if (x instanceof Mypromise) {
                                x.then(resolve, reject);
                            }
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                })

                // 如果是pending状态，我们就不能确定使用什么，等到状态确定之后才能决定。 
            case 'pending':
                return promise2 = new Mypromise(function () {
                    // 注意：一般then都是执行的这里， 即在then的时候进行注册，把相应的成功的和失败的都会初测在这里，push的是一个函数，所以这里的onResolved还是没有执行的。
                    setTimeout(function () {

                        self.doneList.push(function (value) {
                            try {
                                var x = onResolved(self.value)
                                if (x instanceof Mypromise) {
                                    x.then(resolve, reject)
                                } else {
                                    onResolved(value);
                                }
                            } catch (e) {
                                reject(e)
                            }
                        });
                        console.log(self.doneList)
                        self.failList.push(function (value) {
                            try {
                                var x = onRejected(self.data);
                                if (x instanceof Mypromise) {
                                    x.then(resolve, reject);
                                }
                            } catch (e) {

                            }
                        });
                    }, 0);
                })
            default:
                console.log(this.state);
                return;
        }
    },
    catch: function (onRejected) {
        return this.then(null, onRejected);
    }
}

var promise = new Mypromise(function (resolve, reject) {
    if (5 > 3) {
        resolve('success');
    }
});
promise.then(function (value) {
    console.log('哈哈哈哈或');
});