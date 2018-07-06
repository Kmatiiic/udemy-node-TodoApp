// const MongoClient = require('mongodb').MongoClient;
//es6 object destructuring
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', function (err,db) {
    if(err) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB server');


    //query- key:value pairs
    db.collection('Todos').find({completed: false}).toArray().then(function (docs) {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, function (err) {
        console.log('Unable to fetch todos', err);
    });

    // db.close();
});