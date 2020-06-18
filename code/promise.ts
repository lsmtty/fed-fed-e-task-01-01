const enum PromiseStatus {
    Pending,
    Fullfilled,
    Rejected
}

class MyPromise {
    private status: PromiseStatus;

    constructor(executor: (() => any, () => any) => any) {
        this.status = PromiseStatus.Pending;
    }

    private resolve(value) {

    }

    private reject(value) {

    }

    public then(successCallback: () => any | MyPromise, failCallback) {

    }

    public finally() {
        
    }

    static race() {

    }

    static all() {

    }
}