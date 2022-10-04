const request = require("supertest");
const ApiUrl = "http://localhost:8080";
let token = "";
let pathObject = "";

const obj = {
        title: "casas bahiaa",
        totalDistance: 110
}
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


describe("GET path/list", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .get("/path/list")
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                expect(response.status).toEqual(200);
            });
    });
});

describe("POST path/create", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .post("/path/create")
            .send(obj)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                pathObject = response.body.path;
                expect(response.status).toEqual(200);
            });
    });
});

describe("PUT path/update/:id", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .put(`/path/update/${pathObject._id}`)
            .send(obj)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                console.log(token)
                expect(response.status).toEqual(200);

            });
    });
});

describe("DELETE path/delete/:id", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .delete(`/path/delete/${pathObject._id}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                console.log(token)
                expect(response.status).toEqual(200);

            });
    });
});
