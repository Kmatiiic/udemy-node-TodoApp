require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', function(req, res) {
    // console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then(function (doc) {
        res.send(doc);
    }, function (e) {
        res.status(400).send(e);
    });
});

app.get('/todos', function(req, res) {
    Todo.find().then(function(todos) {
        res.send({todos});
    }, function (e) {
        res.status(400).send(e);
    });
});

app.get('/todos/:todoID', function(req,res) {
    var id = req.params.todoID;
    
    if(!ObjectID.isValid(id)) {
       return res.status(404).send();
    }

    Todo.findById(id).then(function(todo) {
        if(!todo) {
           return res.status(404).send();
        }
        //es6 object definition -- same as todo: todo
        res.send({todo});
    }, (e) => res.status(400).send());
});

app.delete('/todos/:todoId', function(req, res) {
    var id = req.params.todoId;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then(function(doc) {
        if(!doc) {
            return res.status(404).send();
        }
        res.send(doc);
    }).catch((e)=> res.status(400).send());
});

app.patch('/todos/:id', function(req,res) {
    var id = req.params.id;
    //lodash - if properties exist pull them off req.body
    //prevent unwanted properties from being updated
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate(id,{$set: body}, {new:true}).then(function(todo) {
        if(!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch(function(e) {
        res.status(400).send();
    });
});

app.post('/users', function(req,res) {
    //object you want to pick from and array filled with the items that you want to pick
    var body = _.pick(req.body, ['email', 'password']);

    //body variable returns an object with credentials
    var user = new User(body);

    user.save().then(function () {
        return user.generateAuthToken();
    }).then(function (token) {
        //custom header x-
        res.header('x-auth', token).send(user);
    }).catch(function(e) {
        res.status(400).send(e);
    });
});



app.get('/users/me', authenticate, function (req,res) {
    res.send(req.user);
});

app.post('/users/login', function(req,res) {
    //object you want to pick from and array filled with the items that you want to pick
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then(function(user) {
       user.generateAuthToken().then(function(token) {
           res.header('x-auth', token).send(user);
       });
    }).catch(function(e) {
        res.status(400).send();
    });
    
});

app.delete('/users/me/token', authenticate, function(req, res) {
    req.user.removeToken(req.token).then(function(user) {
        res.status(200).send();
    }, function() {
        res.status(400).send();
    });
});

app.listen(port, function () {
    console.log(`Started on port ${port}`);
});

module.exports = {app};