const PENDING = 'pending';  // 常量 可 复用 且代码有提示 
const FULLFILLED = 'fullfilled';
const REJECTED = 'rejected';

// 难点 
// 1. 多个执行回调函数，传入函数的错误处理
// 2. 回调函数的返回值 以及all参数可以是普通类型
class MyPromise{

    constructor(exector) {
        try {
            exector(this.resolve, this.reject);
        } catch (error) {
            this.reject(error);  
        }
    }

    status = PENDING;

    // 成功之后的值
    // 失败之后的值

    value = undefined;
    reason = undefined;

    // 成功 失败回调数组
    successCallbackArray = [];

    failCallbackArray = [];

    resolve = value => { // 定义成箭头函数，保证this指向是MyPromise指向
        // 将状态改为成功
        if(this.status !== PENDING) return;
        this.status = FULLFILLED;
        // 保存值

        this.value = value;

        while(this.successCallbackArray.length) this.successCallbackArray.shift()();
    }

    reject = reason => {
        // 将状态改为失败
        if(this.status !== PENDING) return;
        this.status = REJECTED;
        this.reason = reason;

        while(this.failCallbackArray.length) this.failCallbackArray.shift()();
    }

    then(successCallback, failCallback) {
        // 判断 successCallback 是否存在， 不存在补充一个函数. 保证数据可以向后传递
        successCallback = successCallback ? successCallback : value => value;
        failCallback = failCallback ? failCallback : value => value;
        let promise2 = new MyPromise((resolve, reject) => {
            if(this.status === FULLFILLED) { // 执行器的代码会立即执行，可以这么处理
                setTimeout(() => {  // ！很关键 可以通过这种办法变成异步代码
                    try {
                        let x =  successCallback(this.value);
                        this.resolvePromise(promise2, x, resolve, reject); // promise2 通过异步先行创建了，不然 undefined
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
                
            } else if(this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = failCallback(this.reason);
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
                
            } else {
                // this.successCallbackArray.push(successCallback);
                // this.failCallback.push(failCallback);

                this.successCallbackArray.push(() => {
                    setTimeout(() => {
                        try {
                            let x =  successCallback(this.value);
                            this.resolvePromise(promise2, x, resolve, reject); // promise2 通过异步先行创建了，不然 undefined
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });
                this.failCallbackArray.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.reason);
                            this.resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                })
            }
        });
        return promise2;
    }

    resolvePromise(promise2, x, resolve, reject) {
        if(promise2 == x) {
            return reject(new TypeError('Chaning circle '))
        }
        if(x instanceof MyPromise) {
            // promise 对象
            x.then(resolve, reject); // then 相当于查看状态 可以直接输出或者异步回调输出
        } else {
            resolve(x);
        }
    }

    static resolve(value) {
        return value instanceof MyPromise ? value : new MyPromise((resolve) => { resolve(value)});
    }

    static reject(value) {
        return value instanceof MyPromise ? value : new MyPromise((resolve, reject) => { reject(value)});  
    }

    static all(array) { // 数组元素需要考虑普通值
        const result = [];
        let index = 0;
        return new MyPromise((resolve, reject) => {
            function addData(key, value) {
                result[key] = value;
                index++;
                if(index == array.length) {
                    resolve(result);
                }
            }
            for(let i = 0; i < array.length; i++) {
                let current = array[i];
                if(current instanceof MyPromise) {
                    // promise 对象
                    current.then(value => addData(i, value), reason => reject(reason));
                } else {
                    // 普通值
                    addData(i, current);
                }
            }
        });
    }

    static race() {

    }
}