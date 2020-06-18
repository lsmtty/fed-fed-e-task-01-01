const fp = require('lodash/fp');

class Container {
    static of(value) {
        return new Container(value);
    }

    constructor(value) {
        this._value = value
    }

    map(fn) {
        return Container.of(fn(this._value));
    }
}

class Maybe {
    static of(value) {
        return new Maybe(value);
    }

    constructor(value) {
        this._value = value
    }

    isNothing () {
        return this._value == null || this._value == undefined;
    }

    map(fn) {
        return this.isNothing() ? Maybe.of(null) : Maybe.of(fn(this._value));
    }
}


// 1

const maybe1 = Maybe.of([5, 6, 7]);

const ex1 = fp.map(fp.add(1));
console.log(maybe1.map(ex1));

// 2

const xs = Container.of(['do', 'ri', 'mi', 'fa', 'so', 'la', 'ti', 'do']);

const ex2 = function(target) {
    return target.map(fp.first)._value;
};

console.log(ex2(xs));

//3

const safeProp = fp.curry(function(x, o) {
    return Maybe.of(o[x]);
});

const user = { id: 2, name: 'Albert'};

const ex3 = (user) => {
    return safeProp('name')(user).map(fp.first)._value;
}
console.log(ex3(user));

// 4

const ex4 = function(n) {
    return Maybe.of(n).map(parseInt)._value; 
}
console.log(ex4());