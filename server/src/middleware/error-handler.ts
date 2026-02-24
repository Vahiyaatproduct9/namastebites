import { Context, ErrorContext, status } from "elysia";
import { ZodError } from "zod";
import { DatabaseError } from "pg";

export const errorHandler = (err: ErrorContext) => {
  const error = ((err as any)?.error as Error) || new Error("Unknown error");
  console.error("You have an error: ", error);
  if (error instanceof ZodError) {
    err.set.status = 400;
    return {
      status: 400,
      message: "Invalid Input Data",
    };
  }
  if (error instanceof DatabaseError) {
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
