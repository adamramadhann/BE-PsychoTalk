// routeAuth.js
import { Router } from "express";
import { verifyEmail } from "../config/nodeMailer.js";
import AuthController from "../auth/authControler.js";

const routeAuth = Router();
routeAuth.post('/register', AuthController.register);
routeAuth.post('/login', AuthController.login);
routeAuth.get("/verify-email", verifyEmail); 
routeAuth.post("/forgot-password", AuthController.requestResetPassword);
routeAuth.post("/reset-password/:token", AuthController.resetPassword);
routeAuth.post("/registerDoctor", AuthController.registerDoctor);

export default routeAuth;