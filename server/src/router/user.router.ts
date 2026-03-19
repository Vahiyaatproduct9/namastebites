import { createUser, updateUser } from "@controller/user/user.controlller";
import { getLocationDetails } from "@controller/user/location.controller";
import Elysia from "elysia";

const userRouter = new Elysia({ prefix: "/user" })
  .post("/", createUser)
  .patch("/", updateUser)
  .get("/location", getLocationDetails);
export default userRouter;
