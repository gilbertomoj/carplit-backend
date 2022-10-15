const request = require("supertest");
const ApiUrl = "http://localhost:8080";
let token = "";
let tripObject = "";

const obj = {
        name: "Jose",
        address: "Rua Campelo"
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


describe("GET trip/list", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .get("/trip/list")
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                expect(response.status).toEqual(200);
            });
    });
});

describe("POST trip/create", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .post("/trip/create")
            .send(obj)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                tripObject = response.body.passenger;
                expect(response.status).toEqual(200);
            });
    });
});

describe("PUT trip/update/:id", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .put(`/trip/update/${tripObject._id}`)
            .send(obj)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                expect(response.status).toEqual(200);

            });
    });
});

describe("DELETE trip/delete/:id", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .delete(`/trip/delete/${tripObject._id}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                expect(response.status).toEqual(200);

            });
    });
});
