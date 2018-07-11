var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//waits for the connection before a method is executed
mongoose.connect(process.env.MONGODB_URI /*|| 'mongodb://localhost:27017/TodoApp'*/);

module.exports = {mongoose};