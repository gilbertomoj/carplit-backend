const request = require("supertest");
const ApiUrl = "http://localhost:8080";
let token = "";
const obj = {
    name: "Carplit",
    email: "Test@carplit.com",
    password: "test@123",
    average_consumption: 14,
    fuel_per_liter: 11.4,
};

// let user_id = ''

// beforeAll(() => {
//     return request(ApiUrl)
//         .post("/user/login")
//         .send({
//             email: "gaaga@gmail.com",
//             password: "1234",
//         })
//         .expect(200)
//         .then((response) => {
//             expect(response.body.status).toEqual(200);
//             token = response.body.token;
//         });
// });

describe("POST user/register", () => {
    it("should return 200 and a confirmation message", () => {
        return request(ApiUrl)
            .post("/user/register")
            .send(obj)
            .then((response) => {
                expect(response.body.status).toEqual(200);
            });
    });
});

describe("GET /user/login", () => {
    it("should return 200 and return the access token", () => {
        return request(ApiUrl)
            .post("/user/login")
            .send({
                email: obj.email,
                password: obj.password,
            })
            .expect(200)
            .then((response) => {
                token = response.body.token;
                expect(response.body.status).toEqual(200);
            });
    });
});

describe("POST user/verify/email", () => {
    it("should return 400 and a error message", () => {
        return request(ApiUrl)
            .post("/user/verify/email")
            .send({
                email: obj.email,
            })
            .then((response) => {
                expect(response.body.status).toEqual(400);
            });
    });
});

describe("DELETE user/delete", ()=>{
    it("should return 200 and delete a user", ()=>{
        return request(ApiUrl)
            .delete(`/user/delete/`)
            .set('Authorization', `Bearer ${token}`)
            .then((response)=>{
                expect(response.status).toEqual(200);
                expect(response.body).toEqual("Usuário deletado com sucesso");
            })
    })
})