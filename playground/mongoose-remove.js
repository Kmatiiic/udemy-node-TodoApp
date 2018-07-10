const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then(function(res) {
//     console.log(res);
// });

//query by properties
Todo.findOneAndRemove({_id: '32422323some3id'}).then(function(todo) {

});

Todo.findByIdAndRemove('32422323some3id').then(function(todo) {
    console.log(todo);
});