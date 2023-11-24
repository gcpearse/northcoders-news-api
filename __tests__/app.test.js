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
  test("GET:200 responds with an array of article objects, sorted by date (created_at) in descending order, with a default limit of 10 results", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const total_count = body.total_count;
        expect(total_count).toBe(10);
        const articles = body.articles;
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

  describe("GET /api/articles (topic query)", () => {
    test("GET:200 responds with an array of article objects, filtered by the topic value specified in the query", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const total_count = body.total_count;
          expect(total_count).toBe(1);
          const articles = body.articles;
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
          expect(articles).toBeSortedBy("created_at", {
            descending: true
          });
        });
    });

    test("GET:200 responds with an empty array when the topic query is valid but there are no associated articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const total_count = body.total_count;
          expect(total_count).toBe(0);
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

  describe("GET /api/articles (sort_by query)", () => {
    test("GET:200 responds with an array of article objects, sorted by the value specified in the query", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          const total_count = body.total_count;
          expect(total_count).toBe(10);
          const articles = body.articles;
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
          expect(articles).toBeSortedBy("title", {
            descending: true
          });
        });
    });

    test("GET:200 functionality works for columns created by aggregate functions", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body }) => {
          const total_count = body.total_count;
          expect(total_count).toBe(10);
          const articles = body.articles;
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
          expect(articles).toBeSortedBy("comment_count", {
            descending: true
          });
        });
    });

    test("GET:400 responds with an error message when the sort_by value in the query is invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=birds")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
  });

  describe("GET /api/articles (order query)", () => {
    test("GET:200 responds with an array of article objects, ordered by the value specified in the query", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          const total_count = body.total_count;
          expect(total_count).toBe(10);
          const articles = body.articles;
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
            descending: false
          });
        });
    });

    test("GET:400 responds with an error message when the order value in the query is invalid", () => {
      return request(app)
        .get("/api/articles?order=sideways")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
  });

  describe("GET /api/articles (limit query)", () => {
    test("GET:200 responds with an array of article objects, limited to the value of the limit query", () => {
      return request(app)
        .get("/api/articles?limit=5")
        .expect(200)
        .then(({ body }) => {
          const total_count = body.total_count;
          expect(total_count).toBe(5);
          const articles = body.articles;
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

    test("GET:200 responds with all results when the value of limit exceeds the total number of results", () => {
      return request(app)
        .get("/api/articles?limit=20")
        .expect(200)
        .then(({ body }) => {
          const total_count = body.total_count;
          expect(total_count).toBe(13);
          const articles = body.articles;
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

    test("GET:400 responds with an error message when the limit value in the query is a negative integer", () => {
      return request(app)
        .get("/api/articles?limit=-1")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });

    test("GET:400 responds with an error message when the limit value in the query is invalid", () => {
      return request(app)
        .get("/api/articles?limit=ten")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
  });

  describe("GET /api/articles (page query)", () => {
    test("GET:200 responds with an array of article objects, starting from the page number given as the value for the p query", () => {
      return request(app)
        .get("/api/articles?p=2")
        .expect(200)
        .then(({ body }) => {
          const total_count = body.total_count;
          expect(total_count).toBe(3);
          const articles = body.articles;
          expect(articles[0].article_id).toBe(8);
          expect(articles[1].article_id).toBe(11);
          expect(articles[2].article_id).toBe(7);
          expect(articles).toBeSortedBy("created_at", {
            descending: true
          });
        });
    });

    test("GET:200 page query works in tandem with limit query", () => {
      return request(app)
        .get("/api/articles?limit=2&p=4")
        .expect(200)
        .then(({ body }) => {
          const total_count = body.total_count;
          expect(total_count).toBe(2);
          const articles = body.articles;
          expect(articles[0].article_id).toBe(1);
          expect(articles[1].article_id).toBe(9);
          expect(articles).toBeSortedBy("created_at", {
            descending: true
          });
        });
    });

    test("GET:404 responds with an error message when the page query exceeds the total number of pages", () => {
      return request(app)
        .get("/api/articles?p=3")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Page not found");
        });
    });

    test("GET:400 responds with an error message when the page value in the query is invalid", () => {
      return request(app)
        .get("/api/articles?p=two")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });

    test("GET:400 responds with an error message when the page value is an integer smaller than 1", () => {
      return request(app)
        .get("/api/articles?p=0")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
  });

  describe("GET /api/articles (combined queries)", () => {
    test("GET:200 responds with an array of article objects, filtered, sorted, and ordered by the values specified in the queries, with a default limit of 10 results", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=author&order=asc")
        .expect(200)
        .then(({ body }) => {
          const total_count = body.total_count;
          expect(total_count).toBe(10);
          const articles = body.articles;
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: "mitch",
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number)
            });
          });
          expect(articles).toBeSortedBy("author", {
            descending: false
          });
        });
    });

    test("GET:200 topic, sort_by, order, limit and page queries all work in tandem", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=article_id&order=asc&limit=4&p=2")
        .expect(200)
        .then(({ body }) => {
          const total_count = body.total_count;
          expect(total_count).toBe(4);
          const articles = body.articles;
          expect(articles[0].article_id).toBe(6);
          expect(articles[1].article_id).toBe(7);
          expect(articles[2].article_id).toBe(8);
          expect(articles[3].article_id).toBe(9);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: "mitch",
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number)
            });
          });
          expect(articles).toBeSortedBy("article_id", {
            descending: false
          });
        });
    });

    test("GET:400 responds with an error message when the value of any query is invalid", () => {
      return request(app)
        .get("/api/articles?topic=cats&sort_by=title&order=reverse")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
  });
});

describe("POST /api/articles", () => {
  test("POST:201 responds with the newly added article, which should include the properties from the request body along with 'article_id', 'votes', 'created_at', and 'comment_count'", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "How to take care of a cat",
      body: "Read the docs!",
      topic: "cats",
      article_img_url: "https://www.pexels.com/photo/white-and-grey-kitten-on-brown-and-black-leopard-print-textile-45201/"
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 14,
          title: "How to take care of a cat",
          topic: "cats",
          author: "butter_bridge",
          body: "Read the docs!",
          created_at: expect.any(String),
          votes: 0,
          article_img_url: "https://www.pexels.com/photo/white-and-grey-kitten-on-brown-and-black-leopard-print-textile-45201/",
          comment_count: 0
        });
      });
  });

  test("POST:201 assigns a default value to article_img_url when no image URL is provided", () => {
    const lostCatArticle = {
      author: "butter_bridge",
      title: "I've lost my cat",
      body: "But I don't have a picture of him",
      topic: "cats"
    };
    return request(app)
      .post("/api/articles")
      .send(lostCatArticle)
      .expect(201)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 14,
          title: "I've lost my cat",
          topic: "cats",
          author: "butter_bridge",
          body: "But I don't have a picture of him",
          created_at: expect.any(String),
          votes: 0,
          article_img_url: "image_not_provided",
          comment_count: 0
        });
      });
  });

  test("POST:201 ignores any unnecessary properties on the object", () => {
    const mitchArticle = {
      author: "butter_bridge",
      title: "Who is Mitch?",
      body: "I've never even met him",
      topic: "mitch",
      article_img_url: "https://www.pexels.com/photo/question-mark-on-chalk-board-356079/",
      age: 30,
      location: "Skye"
    };
    return request(app)
      .post("/api/articles")
      .send(mitchArticle)
      .expect(201)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: 14,
          title: "Who is Mitch?",
          topic: "mitch",
          author: "butter_bridge",
          body: "I've never even met him",
          created_at: expect.any(String),
          votes: 0,
          article_img_url: "https://www.pexels.com/photo/question-mark-on-chalk-board-356079/",
          comment_count: 0
        });
      });
  });

  test("POST:400 responds with an error message when provided with an invalid article (e.g. no body property)", () => {
    const badArticle = {
      author: "butter_bridge",
      title: "Musing about Mitch",
      topic: "mitch"
    };
    return request(app)
      .post("/api/articles")
      .send(badArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });

  test("POST:404 responds with an error message when the author does not exist", () => {
    const anonymousArticle = {
      author: "secret_user",
      title: "How to take care of a cat",
      body: "Read the docs!",
      topic: "cats",
      article_img_url: "https://www.pexels.com/photo/white-and-grey-kitten-on-brown-and-black-leopard-print-textile-45201/"
    };
    return request(app)
      .post("/api/articles")
      .send(anonymousArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
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
  test("GET:200 responds with an array of all comments on the article with the given article_id, ordered by date (created_at) to show the most recent comments first, limited by default to 10 results", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(10);
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

  describe("GET /api/articles/:article_id/comments (limit query)", () => {
    test("GET:200 responds with an array of comments on the article with the given article_id, limited to the value of the limit query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          expect(comments).toHaveLength(5);
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

    test("GET:200 responds with an array of all comments on the article when the value of limit exceeds the total number of results", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=20")
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

    test("GET:200 responds with an empty array when there are no comments on the article", () => {
      return request(app)
        .get("/api/articles/2/comments?limit=10")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });

    test("GET:200 responds with an empty array when the limit value is zero", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=0")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });

    test("GET:400 responds with an error message when the limit value in the query is a negative integer", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=-1")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });

    test("GET:400 responds with an error message when the limit value in the query is invalid", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=five")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });
  });

  describe("GET /api/articles (page query)", () => {
    test("GET:200 responds with an array of comments on the article with the given article_id, starting from the page number given as the value for the p query", () => {
      return request(app)
        .get("/api/articles/1/comments?p=2")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          expect(comments).toHaveLength(1);
          expect(comments[0].comment_id).toBe(9);
        });
    });

    test("GET:200 page query works in tandem with limit query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=3&p=3")
        .expect(200)
        .then(({ body }) => {
          const comments = body.comments;
          expect(comments).toHaveLength(3);
          expect(comments[0].comment_id).toBe(6);
          expect(comments[1].comment_id).toBe(12);
          expect(comments[2].comment_id).toBe(3);
        });
    });

    test("GET:404 responds with an error message when the page query exceeds the total number of pages", () => {
      return request(app)
        .get("/api/articles/1/comments?p=3")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Page not found");
        });
    });

    test("GET:400 responds with an error message when the page value in the query is invalid", () => {
      return request(app)
        .get("/api/articles/3/comments?p=two")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
    });

    test("GET:400 responds with an error message when the page value is an integer smaller than 1", () => {
      return request(app)
        .get("/api/articles/3/comments?p=-1")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad request");
        });
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

  test("POST:201 ignores any unnecessary object properties", () => {
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

describe("PATCH /api/comments/:comment_id", () => {
  test("PATCH:200 updates the value of the votes property on the comment with the given comment_id, and sends the updated comment back to the client", () => {
    const increment = {
      inc_votes: 3
    };
    return request(app)
      .patch("/api/comments/17")
      .send(increment)
      .expect(200)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toMatchObject({
          comment_id: 17,
          body: "The owls are not what they seem.",
          article_id: 9,
          author: "icellusedkars",
          votes: 23,
          created_at: "2020-03-14T17:02:00.000Z"
        });
      });
  });

  test("PATCH:200 ignores any unnecessary properties on the object", () => {
    const decrement = {
      inc_votes: -1,
      body: "Not a fan"
    };
    return request(app)
      .patch("/api/comments/18")
      .send(decrement)
      .expect(200)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toMatchObject({
          comment_id: 18,
          body: "This morning, I showered for nine minutes.",
          article_id: 1,
          author: "butter_bridge",
          votes: 15,
          created_at: "2020-07-21T00:20:00.000Z"
        });
      });
  });

  test("PATCH:404 responds with an error message when the comment_id is valid but does not exist", () => {
    const incObject = {
      inc_votes: 2
    };
    return request(app)
      .patch("/api/comments/77")
      .send(incObject)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Comment not found");
      });
  });

  test("PATCH:400 responds with an error message when the comment_id is valid but does not exist", () => {
    const decObject = {
      inc_votes: -4
    };
    return request(app)
      .patch("/api/comments/twelve")
      .send(decObject)
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

describe("POST /api/topics", () => {
  test("POST:201 responds with the newly added topic, which should have 'slug' and 'description' properties", () => {
    const newTopic = {
      slug: "wine",
      description: "For passionate oenologists"
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        const topic = body.topic;
        expect(topic).toMatchObject({
          slug: "wine",
          description: "For passionate oenologists"
        });
      });
  });

  test("POST:201 ignores any unnecessary properties on the object", () => {
    const newTopic = {
      slug: "munros",
      description: "The tallest Scottish mountains",
      tags: ["hiking", "walking", "Scotland"]
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        const topic = body.topic;
        expect(topic).toMatchObject({
          slug: "munros",
          description: "The tallest Scottish mountains"
        });
      });
  });

  test("POST:201 if a description is not provided, the value of description is set to null", () => {
    const newTopic = {
      slug: "music",
    };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        const topic = body.topic;
        expect(topic).toMatchObject({
          slug: "music",
          description: null
        });
      });
  });

  test("POST:400 responds with an error message when provided with an invalid article (e.g. no slug property)", () => {
    const badTopic = {
      description: "molluscs"
    };
    return request(app)
      .post("/api/topics")
      .send(badTopic)
      .expect(400)
      .then(({ body }) => {
        const message = body.message;
        expect(message).toBe("Bad request");
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

describe("GET /api/users/:username", () => {
  test("GET:200 responds with a user object matching the given username", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user).toMatchObject({
          username: "rogersop",
          name: "paul",
          avatar_url: "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4"
        });
      });
  });

  test("GET:404 responds with an error message when the username is valid but does not exist", () => {
    return request(app)
      .get("/api/users/forumtroll")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("User not found");
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
