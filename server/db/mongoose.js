var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//waits for the connection before a method is executed
mongoose.connect('mongodb://localhost:37017/TodoApp');

module.exports = {mongoose};