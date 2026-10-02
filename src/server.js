import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import authRoutes from 'authRoutes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)


const port = 3000;
app.listen(port, () => {
    console.log(`Server running at port ${port}...`)
})







