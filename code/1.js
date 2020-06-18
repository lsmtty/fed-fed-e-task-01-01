const promise1 = new Promise(resolve => {
    setTimeout(() => {
        resolve('hello');
    }, 10)
});
const setTimeout2 = function (value) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value + ' lagou');
        }, 10)
    });
}
const setTimeout3 = function (value) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(value + ' I love you');
        }, 10)
    });
}
promise1.then(setTimeout2).then(setTimeout3).then(console.log);
