const request = require("supertest");
const ApiUrl = "http://localhost:8080";
let token = "";
let passengerObject = "";

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


describe("GET passanger/list", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .get("/passenger/list")
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                expect(response.status).toEqual(200);
            });
    });
});

describe("POST passenger/create", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .post("/passenger/create")
            .send(obj)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                passengerObject = response.body.passenger;
                expect(response.status).toEqual(200);
            });
    });
});

describe("PUT passenger/update/:id", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .put(`/passenger/update/${passengerObject._id}`)
            .send(obj)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                expect(response.status).toEqual(200);

            });
    });
});

describe("DELETE passenger/delete/:id", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .delete(`/passenger/delete/${passengerObject._id}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
                expect(response.status).toEqual(200);

            });
    });
});
