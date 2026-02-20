import { Context, ErrorContext } from "elysia";
import { ZodError } from "zod";
import { DatabaseError } from "pg";

export const errorHandler = (err: ErrorContext) => {
  console.error("You have an error: ", err);
  if (err instanceof ZodError) {
    return {
      status: 400,
      message: "Invalid Input Data",
    };
  }
  if (err instanceof DatabaseError) {
    return {
      status: 500,
      message: "Whoops! Our Database is down.",
    };
  }
  return {
    status: 500,
    message: "Internal Server Error",
  };
};
