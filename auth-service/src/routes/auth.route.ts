import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

const _authController = new AuthController();

router.post("/login", authenticateToken, _authController.login);

router.post("/register", _authController.register);

export default router;
