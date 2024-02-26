import express, { Request, Response, NextFunction } from "express";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoute";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import logger from "./utils/logger";
import ErrorHandlerMiddleware from "../presentation/middlewares/errorMiddleware";
import swaggerDocs from "./utils/swagger_docs/swagger";

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT ?? "4000", 10);

app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: '*', 
  credentials: true, 
}));

app.use(bodyParser.json());

// Call swaggerDocs function to set up Swagger documentation
swaggerDocs(app, port);

app.use("/", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);


// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  ErrorHandlerMiddleware(err, req, res, next);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
