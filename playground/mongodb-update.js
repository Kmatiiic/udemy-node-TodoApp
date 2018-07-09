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

    //findOneAndUpdate(filter, update, options, callback)
    //update operators - $inc, $rename, $set, $unset
    //options - projection, sort, returnOriginal
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID("id #")
    }, {$set: {
        completed: true
    } }, {
        returnOriginal: false 
     }).then(function (result) {
        console.log(JSON.stringify(results, undefined, 2));
    });


    // db.close();
});