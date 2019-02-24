import { Response } from "express";

export interface ResponseMetadata {
  datetime: string;
  request_url?: string;
  errId?: string;
  [k: string]: any;
}

export interface HttpSender {
  send(res: Response): any;
}
