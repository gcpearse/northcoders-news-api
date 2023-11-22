const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("GET:200 responds with an object describing all available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles", () => {
  test("GET:200 responds with an array of article objects, sorted by date (created_at) in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          });
        });
        expect(articles).toBeSortedBy("created_at", {
          descending: true
        });
      });
  });
});

describe("GET /api/articles?topic=", () => {
  test("GET:200 responds with an array of article objects, filtered by the topic value specified in the query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: "cats",
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number)
          });
        });
      });
  });

  test("GET:200 responds with an empty array when the topic query is valid but there are no associated articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(0);
      });
  });

  test("GET:404 responds with an error message when the topic value in the query is invalid", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Your search did not match any results");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET:200 responds with an article object that shows the total number of comments for the article with the given article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11
        });
      });
  });

  test("GET:404 responds with an error message when the article_id is valid but does not exist", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article not found");
      });
  });

  test("GET:400 responds with an error message when the article_id is invalid", () => {
    return request(app)
      .get("/api/articles/one")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH:200 updates the value of the votes property on the article with the given article_id, and sends the updated article back to the client", () => {
    const increment = {
      inc_votes: 1
    };
    return request(app)
      .patch("/api/articles/10")
      .send(increment)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 10,
          title: "Seven inspirational thought leaders from Manchester UK",
          topic: "mitch",
          author: "rogersop",
          body: "Who are we kidding, there is only one, and it's Mitch!",
          created_at: "2020-05-14T04:15:00.000Z",
          votes: 1,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        });
      });
  });

  test("PATCH:200 ignores any unnecessary properties on the object", () => {
    const decrement = {
      inc_votes: -4,
      body: "I've changed my mind"
    };
    return request(app)
      .patch("/api/articles/9")
      .send(decrement)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 9,
          title: "They're not exactly dogs, are they?",
          topic: "mitch",
          author: "butter_bridge",
          body: "Well? Think about it.",
          created_at: "2020-06-06T09:10:00.000Z",
          votes: -4,
          article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        });
      });
  });

  test("PATCH:400 responds with an error message when provided with an invalid patch request (e.g. value of inc_votes is not a number)", () => {
    const badPatchRequest = {
      inc_votes: "add one"
    };
    return request(app)
      .patch("/api/articles/3")
      .send(badPatchRequest)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });

  test("PATCH:404 responds with an error message when the article_id is valid but does not exist", () => {
    const goodPatchRequest = {
      inc_votes: 4
    };
    return request(app)
      .patch("/api/articles/300")
      .send(goodPatchRequest)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article not found");
      });
  });

  test("PATCH:400 responds with an error message when the article_id is invalid", () => {
    const examplePatchRequest = {
      inc_votes: 9
    };
    return request(app)
      .patch("/api/articles/eight")
      .send(examplePatchRequest)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET:200 responds with an array of all comments on the article with the given article_id, ordered by date (created_at) to show the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String)
          });
        });
        expect(comments).toBeSortedBy("created_at", {
          descending: true
        });
      });
  });

  test("GET:200 responds with an empty array when the article_id is valid but there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });

  test("GET:404 responds with an error message when the article_id is valid but does not exist", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article not found");
      });
  });

  test("GET:400 responds with an error message when the article_id is invalid", () => {
    return request(app)
      .get("/api/articles/one/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST:201 posts a new comment to the article with the given article_id, and sends the new comment back to the client", () => {
    const newComment = {
      username: "lurker",
      body: "Has anyone heard any more about this?"
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toMatchObject({
          comment_id: 19,
          body: 'Has anyone heard any more about this?',
          article_id: 5,
          author: 'lurker',
          votes: 0,
          created_at: expect.any(String)
        });
      });
  });

  test("POST:201 posts a new comment to the article with the given article_id, and sends the new comment back to the client while ignoring any unnecessary object properties", () => {
    const newComment = {
      username: "lurker",
      body: "Is this comment acceptable?",
      votes: 5
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toMatchObject({
          comment_id: 19,
          body: 'Is this comment acceptable?',
          article_id: 4,
          author: 'lurker',
          votes: 0,
          created_at: expect.any(String)
        });
      });
  });

  test("POST:400 responds with an error message when provided with an invalid comment (e.g. no body property)", () => {
    const badComment = {
      username: "lurker"
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(badComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });

  test("POST:404 responds with an error message when the username does not exist", () => {
    const anonymousComment = {
      username: "unregistered_user",
      body: "I do not want to register"
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(anonymousComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
      });
  });

  test("POST:404 responds with an error message when the article_id is valid but does not exist", () => {
    const goodComment = {
      username: "lurker",
      body: "I know how to write a good comment"
    };
    return request(app)
      .post("/api/articles/250/comments")
      .send(goodComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
      });
  });

  test("POST:400 responds with an error message when the article_id is invalid", () => {
    const exampleComment = {
      username: "lurker",
      body: "Why is this not working?"
    };
    return request(app)
      .post("/api/articles/seven/comments")
      .send(exampleComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE:204 deletes the comment with the given ID, responding with a 204 status code and no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204);
  });

  test("DELETE:404 responds with an error message when the comment_id is valid but does not exist", () => {
    return request(app)
      .delete("/api/comments/111")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Comment not found");
      });
  });

  test("DELETE:400 responds with an error message when the comment_id is invalid", () => {
    return request(app)
      .delete("/api/comments/twenty")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("GET /api/topics", () => {
  test("GET:200 responds with an array of topics objects, each with 'slug' and 'description' properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics).toHaveLength(3);
        topics.forEach(topic => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String)
          });
        });
      });
  });
});

describe("GET /api/users", () => {
  test("GET:200 responds with an array of user objects, each with 'username', 'name', and 'avatar_url' properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String)
          });
        });
      });
  });
});

describe("ANY /api/notapath", () => {
  test("404: responds with an error message if path not found", () => {
    return request(app)
      .get("/api/notapath")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Path not found");
      });
  });
});
