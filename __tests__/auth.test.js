const request = require("supertest");
const ApiUrl = "http://localhost:8080";
let token = '';

beforeAll(() => {
  return request(ApiUrl)
    .post("/user/login")
    .send({
        email: "gaaga@gmail.com",
        password: "1234"
    })
    .expect(200)
    .then(response => {
        expect(response.body.status).toEqual(200);
        token = response.body.token;
    });
})

describe("GET /user/login", () => {
  it("should return 200 and return the access token", () => {
    return request(ApiUrl)
      .post("/user/login")
      .send({
        email: "gaaga@gmail.com",
        password: "1234"
      })
      .expect(200)
      .then(response => {
        expect(response.body.status).toEqual(200);
      });
  });
});