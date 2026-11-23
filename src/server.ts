import app from "./app.js";

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
    console.log(`Servidor executando em http://localhost:${port}`);
    console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});
