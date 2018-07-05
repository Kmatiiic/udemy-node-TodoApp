const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', function (err,client) {
    if(err) {
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    db.collection("Todos").insertOne({
        text: 'Something to do',
        completed: false
    }, function (err, result) {
        if(err) {
            return console.log('Unable to insert todo', err);
        }

        //result.ops contain all things that were added
        console.log(JSON.stringify(result.ops, undefined, 2));
    });
    client.close();
});