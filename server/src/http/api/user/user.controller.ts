import { getManager } from 'typeorm';
import { ErrorResponse } from '../../response/error';
import User from '../../../models/user';
import { ResponseWriter } from '../../response/response.interface';
import { OkResponse } from '../../response/ok';

export async function fetchUserById(userId: string): Promise<ResponseWriter> {
  if (!userId) {
    return new ErrorResponse({
      error: `User Id is required`,
      status: ErrorResponse.BadRequest,
    });
  }

  const user = await getManager()
    .createQueryBuilder(User, 'user')
    .where('user.id = :id', { id: userId })
    .getOne();

  return new OkResponse({
    user,
  });
}
