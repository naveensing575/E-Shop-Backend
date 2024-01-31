import express, { Request, Response, NextFunction } from "express";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoute";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import logger from "./utils/logger";

dotenv.config();

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);

  if (process.env.NODE_ENV === 'development') {
    res.status(500).send(err.stack ?? 'Something went wrong!');
  } else {
    res.status(500).send('Something went wrong!');
  }
});

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));
app.use(bodyParser.json());
app.use("/", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);


const port = process.env.PORT ?? 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
