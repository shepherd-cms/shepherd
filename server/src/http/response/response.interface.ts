import { Response } from 'express';

export interface ResponseMetadata {
  datetime: string;
  request_url?: string;
  errId?: string;
  [k: string]: any;
}

export interface ResponseWriter {
  render(res: Response): any;
}
