require("express-async-errors");
const AppError = require("./utils/AppError");
const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(routes);

app.use((error, request, response, next) => {
    // Verifica se o erro é uma instância da classe AppError.
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    // Se não for um erro controlado, loga o erro no console.
    console.error(error);

    // Retorna uma resposta de erro interno do servidor (status 500).
    return response.status(500).json({
        status: "error",
        message: "Internal server error"
    });
});

const PORT = 3333;

// Inicia o servidor Express na porta especificada.
app.listen(PORT, () => console.log(`Server is running ${PORT}`));