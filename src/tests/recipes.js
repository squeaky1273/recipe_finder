// test/posts.js
const app = require("./../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

// Import the Post model from our models folder so we
// we can use it in our tests.
const Recipe = require('../models/recipe');
const User = require('../models/user');
// const server = require('../server');
const agent = chai.request.agent(app);

chai.should();
chai.use(chaiHttp);

describe('Recipes', function () {
    // const agent = chai.request.agent(server);
    // Recipe that we'll use for testing purposes
    const newRecipe = {
        title: 'recipe name',
        servings: 'recipe servings',
    };
    const user = {
        username: 'recipestest',
        password: 'testrecipes'
    };
    before(function (done) {
        agent
            .post('/sign-up')
            .set("content-type", "application/x-www-form-urlencoded")
            .send(user)
            .then(function (res) {
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
    after(function (done) {
        Recipe.findOneAndDelete(newRecipe)
            .then(function (res) {
                agent.close()

                User.findOneAndDelete({
                        username: user.username
                    })
                    .then(function (res) {
                        done()
                    })
                    .catch(function (err) {
                        done(err);
                    });
            })
            .catch(function (err) {
                done(err);
            });
    });
    it('Should create with valid attributes at POST /posts/new', function (done) {
        // Checks how many posts there are now
        Recipe.estimatedDocumentCount()
            .then(function (initialDocCount) {
                agent
                    .post("/recipes/new")
                    // This line fakes a form recipe,
                    // since we're not actually filling out a form
                    .set("content-type", "application/x-www-form-urlencoded")
                    // Make a request to create another
                    .send(newRecipe)
                    .then(function (res) {
                        Recipe.estimatedDocumentCount()
                            .then(function (newDocCount) {
                                // Check that the database has one more recipe in it
                                expect(res).to.have.status(200);
                                // Check that the database has one more recipe in it
                                expect(newDocCount).to.be.equal(initialDocCount + 1)
                                done();
                            })
                            .catch(function (err) {
                                done(err);
                            });
                    })
                    .catch(function (err) {
                        done(err);
                    });
            })
            .catch(function (err) {
                done(err);
            });
    });
});