const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticated(request, response, next){
    const authCookie = request.cookies.token;

    if (!authCookie){
        throw new AppError("JWT Token não informado", 401);
    }

    try {
        const { sub: user_id, role } = verify(authCookie, authConfig.jwt.secret);

        request.user = {
            id: Number(user_id),
            role: role,
        }

        return next();
    } catch (error) {
        throw new AppError("JWT Token inválido", 401);
    }
}

module.exports = ensureAuthenticated;
