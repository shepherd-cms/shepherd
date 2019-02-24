import bcrypt from "bcrypt";
import { getConnection, getManager } from "typeorm";
import User from "../../../models/user";
import * as jwt from "jsonwebtoken";
import { HttpSender } from "../../response/response.interface";
import { ErrorResponse } from "../../response/error";
import { OkResponse } from "../../response/ok";
import { logger } from "../../../log";
import { durationTo, Duration } from "../../../time/time";

export interface SignUpParams {
  email: string;
  /**
   * Plain text password.
   */
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Creates a new Shepherd user.
 */
export async function createNewUser(params: SignUpParams): Promise<HttpSender> {
  let { email, firstName, lastName, password } = params;

  const hasUser = await getManager()
    .createQueryBuilder(User, "user")
    .where("user.email = :email", { email })
    .getOne();

  if (hasUser) {
    return new ErrorResponse({
      error: `User Already Exists for ${email}`,
      metadata: { email },
      status: ErrorResponse.BadRequest,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  logger.debug({ hashedPassword });

  // create new user
  const user = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(User)
    .values([
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    ])
    .execute();
  logger.debug({ user });

  return OkResponse.NewCreated();
}

/**
 * Required parameters for a user to login.
 */
export interface LoginParams {
  email: string;
  password: string;
}

/**
 * Verifies that a user does exist with the given credentials, as well as
 * hash comparing that the user password is a match. If user authentication
 * succeeds, returns a json web token and a basic user object.
 */
export async function loginUser(params: LoginParams): Promise<HttpSender> {
  let { email, password } = params;

  if (!email) {
    return new ErrorResponse({
      error: `Email is required`,
      status: ErrorResponse.BadRequest,
    });
  }

  if (!password) {
    return new ErrorResponse({
      error: `Password is required`,
      status: ErrorResponse.BadRequest,
    });
  }

  const user = await getManager()
    .createQueryBuilder(User, "user")
    .where("user.email = :email", { email: email })
    .getOne();

  if (!user) {
    return new ErrorResponse({
      error: "No user exists with that email",
      metadata: { email: email },
      status: ErrorResponse.BadRequest,
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return new ErrorResponse({
      error: "Password is incorrect",
      metadata: { email: email },
      status: ErrorResponse.BadRequest,
    });
  }

  let token = createToken({ id: user.id });
  const { firstName, lastName, id } = user;

  return new OkResponse({
    token,
    user: {
      firstName,
      lastName,
      id,
      email,
    },
  });
}

/**
 * Decodes the token and resolves with the payload,
 * or rejects if the token signature does not verify
 * or an error occurs.
 */
export function verifyToken(token: string): Promise<TokenMetadata> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "test" /* secret */, (err, decodedToken) => {
      if (err || !decodedToken) {
        logger.error({ jwtError: err });
        return reject(err);
      }
      logger.debug({ decodedToken });
      resolve(decodedToken as any);
    });
  });
}

export interface TokenMetadata {
  token: string;
  expiresIn: number;
}

interface JwtPayload {
  id: string;
}

/**
 * Creates a json web token embedding the user object in the payload.
 */
function createToken(payload: JwtPayload): TokenMetadata {
  const expiresIn = durationTo.second(Duration.Hour);
  const secret = "test";

  return {
    expiresIn,
    token: jwt.sign(payload, secret, { expiresIn }),
  };
}
