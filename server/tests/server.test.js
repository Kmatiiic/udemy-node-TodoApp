const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
},
{
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 777
}];
beforeEach(function(done) {
    //removes all todos in database
    Todo.remove({}).then(function() {
       return Todo.insertMany(todos);
    }).then(() => done());
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
                Todo.find({text}).then(function (todos) {
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
                    //dummy todos added to test get todo route
                    expect(todos.length).toBe(2); //check if item was added
                    done();
                }).catch(function (e) {
                    done(e);
                });
            });
    });

});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
  });

  describe('PATCH /todos/:id', function() {
      it('it should update the todo', function(done) {
          var hexId = todos[0]._id.toHexString();
          var text = 'new text';
          request(app)
          .patch(`/todos/${hexId}`)
          .send({
              completed: true,
              text
          })
          .expect(200)
          .expect((res) => {
              expect(res.body.todo.text).toBe(text);
              expect(res.body.todo.completed).toBe(true);
              expect(res.body.todo.completedAt).toBeA('number');
             })
             .end(done);
      });

        

      it('it should clear completedAt when todo is not completed ', function(done) {
        var hexId = todos[1]._id.toHexString();
        var text = 'new text 2';
        request(app)
        .patch(`/todos/${hexId}`)
        .send({
            completed: false,
            text
        })
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
           })
           .end(done);
    });
  });