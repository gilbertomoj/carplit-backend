const request = require("supertest");
const ApiUrl = "http://localhost:8080";
let token = "";
beforeAll(() => {
    return request(ApiUrl)
        .post("/user/login")
        .send({
            email: "test@carplit.com",
            password: "1234",
        })
        .expect(200)
        .then((response) => {
            expect(response.body.status).toEqual(200);
            token = response.body.token;
        });
});

describe("POST path/create", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .post("/user/register")
            .send(obj)
            .then((response) => {
                expect(response.body.status).toEqual(200);
            });
    });
});
