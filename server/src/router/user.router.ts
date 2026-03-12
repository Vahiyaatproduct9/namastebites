import { createUser } from "@controller/user/user.controlller";
import Elysia from "elysia";

const userRouter = new Elysia({ prefix: "/user" }).post("/", createUser);
export default userRouter;
