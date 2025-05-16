// routeAuth.js
import { Router } from "express";
import { verifyEmail } from "../config/nodeMailer.js";
import AuthController from "../auth/authControler.js";
import { upload } from "../config/upload.js";

const routeAuth = Router();
routeAuth.post('/register', upload.single("avatar"), AuthController.register);
routeAuth.post('/login', AuthController.login);
routeAuth.get("/verify-email", verifyEmail); 
routeAuth.post("/forgot-password", AuthController.requestResetPassword);
routeAuth.post("/reset-password/:token", AuthController.resetPassword); 

export default routeAuth;