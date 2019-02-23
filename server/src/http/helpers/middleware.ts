import { Response, Request } from 'express';
import { verifyToken, DataStoredInToken } from '../api/auth/auth.controller';
import { ErrorResponse } from '../response/error';
import { logger } from '../../log';
export function verifyToken_MW(req: Request, res: Response, next: Function) {
  const header = req.headers['authorization'];
  if (!header) {
    return new ErrorResponse({
      status: ErrorResponse.Unauthorized,
    }).render(res);
  }

  const bearer = header.split(' ');
  const token = bearer[1];
  verifyToken(token)
    .then((decodedToken: any) => {
      req.user = decodedToken.id;
      next();
    })
    .catch((err: any) => {
      new ErrorResponse({
        error: 'invalid_token',
        status: ErrorResponse.Forbidden,
      }).render(res);
    });
}
