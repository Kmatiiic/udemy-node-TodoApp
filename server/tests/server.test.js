const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach(function(done) {
    //removes all todos in database
    Todo.remove({}).then(() => done());
});

describe('POST /todos', function () {
    it('should create a new todo', function (done) {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text}) //object gets converted to json data
            .expect(200)
            .expect(function (res) {
                expect(res.body.text).toBe(text);
            })
            .end(function (err, res) {
                if(err) {
                    return done(err);
                }

                //make a request to the database to fetch todos
                // to verifying the todo was added
                Todo.find().then(function (todos) {
                    expect(todos.length).toBe(1); //check if item was added
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch(function (e) {
                    done(e);
                });
            });
    });

    it('should not create todo with invalid body data', function (done) {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({}) //object gets converted to json data
            .expect(400)

            .end(function (err, res) {
                if(err) {
                    return done(err);
                }

                //make a request to the database to fetch todos
                // to verifying the todo was added
                Todo.find().then(function (todos) {
                    expect(todos.length).toBe(0); //check if item was added
                    done();
                }).catch(function (e) {
                    done(e);
                });
            });
    });

});