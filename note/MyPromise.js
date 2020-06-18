const PENDING = 'pending';  // 常量 可 复用 且代码有提示 
const FULLFILLED = 'fullfilled';
const REJECTED = 'rejected';

class MyPromise{

    constructor(exector) {
        exector(this.resolve, this.reject);
    }

    status = PENDING;

    // 成功之后的值
    // 失败之后的值

    value = undefined;
    reason = undefined;

    resolve = value => { // 定义成箭头函数，保证this指向是MyPromise指向
        // 将状态改为成功
        if(this.status !== PENDING) return;
        this.status = FULLFILLED;
        // 保存值

        this.value = value;
    }

    reject = reason => {
        // 将状态改为失败
        if(this.status !== PENDING) return;
        this.status = REJECTED;
        this.reason = reason;
    }

    then(successCallback, failCallback) {
        if(this.status === FULLFILLED) {
            successCallback(this.value);
        } else if(this.status === REJECTED) {
            failCallback(this.reason);
        }
    }
}