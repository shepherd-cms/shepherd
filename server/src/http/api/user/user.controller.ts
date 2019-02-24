import { getManager } from "typeorm";
import { ErrorResponse } from "../../response/error";
import User from "../../../models/user";
import { HttpSender } from "../../response/response.interface";
import { OkResponse } from "../../response/ok";

/**
 * Returns a user from the database.
 */
export async function fetchUserById(userId: number): Promise<HttpSender> {
  if (!userId) {
    return new ErrorResponse({
      error: `User Id is required`,
      status: ErrorResponse.BadRequest,
    });
  }

  const user = await getManager()
    .createQueryBuilder(User, "user")
    .where("user.id = :id", { id: userId })
    .getOne();

  return new OkResponse({
    user,
  });
}
