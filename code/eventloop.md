# eventlop 

## 
* JavaScript语言的执行环境是“单线程”。“异步模式”下每个任务有一个或多个回调函数，前一个任务结束后，不是执行后一个任务，而是执行回调函数。
Event Loop（是一个程序结构，用于等待和发送消息和事件）,用于处理主线程外的非阻塞事件。 分为三部分：主线程、宏队列（macrotask）、微队列（microtask）

### 主线程

* script标签里面包含的内容，或者当前作用域直接执行的内容（方法、new出来的对象）

### 宏队列（macrotask）

* setTimeout、setInterval、setImmediate、I/O、UI rendering

### 微队列 (microtask)

* promise.then、process.nextTick

### 执行顺序 

1. 执行主线程
2. 遇到宏任务，放到宏任务队列。
3. 如果有宏任务取出执行，同步代码执行，如果遇到微任务放到微任务队列。
4. 执行完毕宏任务，查看微任务队列。依次执行微任务，直到微任务队列为空。
5. 循环eventloop, 拿出下一个宏任务执行。
