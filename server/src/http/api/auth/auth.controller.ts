import { getConnection, getManager } from 'typeorm';
import { Request, Response } from 'express';
import User from '../../../models/user';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ResponseWriter } from '../../response/response.interface';
import { ErrorResponse } from '../../response/error';
import { OkResponse } from '../../response/ok';
import { logger } from '../../../log';

interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface TokenData {
  token: string;
  expiresIn: number;
}

export interface DataStoredInToken {
  id: string;
}

export async function createNewUser(
  params: SignUpParams,
): Promise<ResponseWriter> {
  let { email, firstName, lastName, password } = params;

  if (!email) {
    return new ErrorResponse({
      error: `Email is required`,
      status: ErrorResponse.BadRequest,
    });
  }

  if (!firstName) {
    return new ErrorResponse({
      error: `FirstName is required`,
      status: ErrorResponse.BadRequest,
    });
  }

  if (!lastName) {
    return new ErrorResponse({
      error: `LastName is required`,
      status: ErrorResponse.BadRequest,
    });
  }

  if (!password) {
    return new ErrorResponse({
      error: `Password is required`,
      status: ErrorResponse.BadRequest,
    });
  }

  const hasUser = await getManager()
    .createQueryBuilder(User, 'user')
    .where('user.email = :email', { email: email })
    .getOne();

  if (hasUser) {
    return new ErrorResponse({
      error: `User Already Exists for ${email}`,
      metadata: { email: email },
      status: ErrorResponse.BadRequest,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('hashedPassword', hashedPassword);
  // create new user
  const userResult = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(User)
    .values([
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      },
    ])
    .execute();

  return OkResponse.NewCreated();
}

export async function loginUser(params: LoginParams): Promise<ResponseWriter> {
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
    .createQueryBuilder(User, 'user')
    .where('user.email = :email', { email: email })
    .getOne();

  if (!user) {
    return new ErrorResponse({
      error: 'No user exists with that email',
      metadata: { email: email },
      status: ErrorResponse.BadRequest,
    });
  }

  const doPasswordsMatch = await bcrypt.compare(password, user.password);
  if (!doPasswordsMatch) {
    return new ErrorResponse({
      error: 'Password is incorrect',
      metadata: { email: email },
      status: ErrorResponse.BadRequest,
    });
  }

  let token = createToken(user);
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

export function verifyToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'test', (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err);
      }
      resolve(decodedToken);
    });
  });
}

function createToken(user: any): TokenData {
  const expiresIn = 60 * 60; // an hour
  const secret = 'test';
  const dataStoredInToken: DataStoredInToken = {
    id: user.id,
  };
  return {
    expiresIn,
    token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
  };
}
