import "reflect-metadata";
import express from "express";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Post } from "./entity/Post";
import { UserService } from "./Service/User";
import { PostService } from "./Service/Post";
import { ApiError } from "./@type/error";

const app = express();
app.use(express.json());

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "test_db",
  entities: [User, Post],
  synchronize: true,
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const initializeDatabase = async () => {
  await wait(20000);
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (err) {
    console.error("Error during Data Source initialization:", err);
    process.exit(1);
  }
};

initializeDatabase();

app.post("/users", async (req, res) => {
  const userBody = req.body;

  const result = await UserService.createUser(userBody);
  const error = result as ApiError;

  if (error.error) {
    return res.status(error.status).send(error.error);
  }

  res.status(201).send(result);
});

app.post("/posts", async (req, res) => {
  const postBody = req.body;

  const result = await PostService.createPost(postBody);
  const error = result as ApiError;

  if (error.error) {
    return res.status(error.status).send(error.error);
  }

  res.status(201).send(result);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
