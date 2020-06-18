const enum PromiseStatus {
    Pending,
    Fullfilled,
    Rejected
}

class MyPromise {
    private status: PromiseStatus = PromiseStatus.Pending;
    private value: any;
    private errorData: any;
    private successCallbackArray: Array<Function>;
    private failCallbackArray: Array<Function>;

    constructor(executor) {
        try {
            executor(this.resolve, this.reject);
        } catch (error) {
            this.reject(error);
        }
    }

    private resolve(value) {
        if(this.status == PromiseStatus.Pending) {
            this.value = value;
            this.status = PromiseStatus.Fullfilled;
            this.successCallbackArray.forEach(successCallback => {
                successCallback(value);
            })
        }
    }

    private reject(e) {
        if(this.status == PromiseStatus.Pending)  {
            this.status = PromiseStatus.Rejected;
            this.errorData = e;
            this.failCallbackArray.forEach(failCallback => {
                failCallback(e);
            })
        }
    }

    public then(successCallback?: (value: any) => any, failCallback?: (e : any) => any) : MyPromise{
        successCallback = successCallback ? successCallback : value => value;
        failCallback = failCallback ? failCallback : e => { throw e };
        const promise2 = new MyPromise((resolve, reject) => {
            if(this.status == PromiseStatus.Pending) {
                this.successCallbackArray.push(() => {
                    try {
                        setTimeout(() => {
                            let data = successCallback!(this.value);
                            this.resolvePromise(promise2, data , resolve ,reject);
                        }, 0);
                    } catch (error) {
                        reject(error);
                    }
                });
                this.failCallbackArray.push(() => {
                    try {
                        setTimeout(() => {
                            let data = successCallback!(this.value);
                            this.resolvePromise(promise2, data , resolve ,reject);
                        }, 0);
                    } catch (error) {
                        reject(error);
                    }
                });
            } else if(this.status == PromiseStatus.Fullfilled) {
                try {
                    setTimeout(() => {
                        let data = successCallback!(this.value);
                        this.resolvePromise(promise2, data , resolve ,reject);
                    }, 0);
                } catch (error) {
                    reject(error);
                }
            } else if(this.status == PromiseStatus.Rejected) {
                try {
                    setTimeout(() => {
                        let data = successCallback!(this.value);
                        this.resolvePromise(promise2, data , resolve ,reject);
                    }, 0);
                } catch (error) {
                    reject(error);
                }
            }
        });
        return promise2;
    }

    private resolvePromise(promise: MyPromise, x: any, resolve: (value: any) => any, reject: (e : any) => any) {
        if(promise == x) {
            throw TypeError('illegal chaning');
        }
        if(x instanceof MyPromise) {
            x.then(resolve, reject);
        } else {
            resolve(x);
        }
    }

    public catch(failCallback: (e) => any): MyPromise {
        return this.then(undefined, failCallback);
    }

    public finally(callback): MyPromise {
        return this.then(value => {
            return MyPromise.resolve(callback()).then(() => value);
        }, e=> {
            return MyPromise.resolve(callback()).then(() => { throw e});
        });
    }

    static resolve(value: any) {
        return value instanceof MyPromise ? value : new MyPromise((resolve) => resolve(value) );
    }

    static reject(e) {
        return e instanceof MyPromise ? e : new MyPromise((undefined, reject) => reject(e));
    }

    static all(originArray: Array<any>): MyPromise {
        let dataArray: Array<any> = [];
        let index = 0;
        return new MyPromise((resolve, reject) => {
            for(let i = 0; i < originArray.length; i++) {
                let originData = originArray[i];
                if(originData instanceof MyPromise) {
                    originData.then((value) => {
                        dataArray[i] = value;
                        index++;
                        if(index == originArray.length) {
                            resolve(dataArray);
                        }
                    }, (e) => {
                        reject(e);
                    });
                } else {
                    dataArray[i] = originData;
                    index ++;
                    if(index == originArray.length) {
                        resolve(dataArray);
                    }
                }
            }
        })
    }

    static race(originArray: Array<any>): MyPromise {
        return new MyPromise((resolve, reject) => {
            for(let i = 0; i < originArray.length; i++) {
                let originData = originArray[i];
                if(originData instanceof MyPromise) {
                    originData.then(value => resolve(value), e => reject(e));
                } else {
                    resolve(originData);
                }
            }
        });
    }

}