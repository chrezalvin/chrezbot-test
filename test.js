const my = require("./testModule");


class Person {
    constructor(name){
        this.name = name;
    }
    
    changeName(name){
        this.name = name;
    }
}

const myPerson = new Person("andrew");
my.myFunction(myPerson);

console.log(myPerson.name);