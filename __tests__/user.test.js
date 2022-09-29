const request = require("supertest");
const ApiUrl = "http://localhost:8080";
let token = "";
const obj = {
    name: "Carplit",
    email: "test@carplitest.com",
    password: "test@123",
    average_consumption: 14,
    fuel_per_liter: 11.4,
};

beforeAll(() => {
    return request(ApiUrl)
        .post("/user/login")
        .send({
            email: "gaaga@gmail.com",
            password: "1234",
        })
        .expect(200)
        .then((response) => {
            expect(response.body.status).toEqual(200);
        });
});

describe("GET /user/login", () => {
    it("should return 200 and return the access token", () => {
        return request(ApiUrl)
            .post("/user/login")
            .send({
                email: "gaaga@gmail.com",
                password: "1234",
            })
            .expect(200)
            .then((response) => {
                expect(response.body.status).toEqual(200);
            });
    });
});

describe("POST user/verify/email", () => {
    it("should return 400 and a error message", () => {
        return request(ApiUrl)
            .post("/user/verify/email")
            .send({
                email: "gaaga@gmail.com",
            })
            .then((response) => {
                expect(response.body.status).toEqual(400);
            });
    });
});

describe("POST user/register", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .post("/user/register")
            .send(obj)
            .then((response) => {
                console.log(response.body);
                expect(response.body.status).toEqual(200);
            });
    });
});

describe("POST user/login", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .post("/user/login")
            .send({
                email: "test@carplit.com",
                password: "test@123",
            })
            .then((response) => {
                console.log(response.body);
                expect(response.body.status).toEqual(200);
            });
    });
});
