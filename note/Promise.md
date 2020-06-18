* 三种状态 pending, rejected, fullfilled
* resolve, reject 可以更改状态， 只能更改一次
* then 方法内部状态判断 
* 成功和失败回调都有一个值
* then 方法链式调用， 所以 then的基本原理是返回一个promise对象
* 判断 x 是 普通值还是promise对象， 如果是promise对象需要查看状态