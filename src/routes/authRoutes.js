import express from "express";
import { register, login, getMe, logout} from "../controllers/authControllers";
import authenticateToken from "../middleware/authMiddleware";


const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/getme", authenticateToken, getMe)
router.post("/logout", logout)

export default router;
