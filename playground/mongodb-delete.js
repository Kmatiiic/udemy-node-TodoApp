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
    //deleteMany
    // db.collection('Todos').deleteMany({}).then(function (result) {
    //     console.log(result);
    // });

    // //deleteOne
    // db.collection('Todos').deleteOne({}).then(function (result) {
    //     console.log(result);
    // });

    // //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({}).then(function (result) {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID("id #")
    }).then(function (result) {
        console.log(JSON.stringify(results, undefined, 2));
    });


    // db.close();
});