/*app.test.js*/

const request = require ("supertest");
const app = require("./app");

describe("Pruebas de API Auth", () => {
  let token;

  test("Debe registrar un usuario", async () => {
    const res = await request(app)
      .post("/api/register")
      .send({ username: "valeria", password: "1234", email: "valeria@ejemplo.com" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Usuario registrado");
  });

    test("Debe iniciar sesión y devolver un token", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "valeria", password: "1234" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("Debe acceder a recurso protegido con token válido", async () => {
    const res = await request(app)
      .get("/api/protected-resource")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data", "Recurso secreto ");
  });

  test("Debe cerrar sesión y bloquear el token", async () => {
    const res = await request(app)
      .post("/api/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    // Intentar acceder de nuevo con el mismo token debería fallar
    const res2 = await request(app)
      .get("/api/protected-resource")
      .set("Authorization", `Bearer ${token}`);

    expect(res2.statusCode).toBe(403);
  });
});