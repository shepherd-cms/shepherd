import { performance } from "perf_hooks";
import { Request, Response, Handler } from "express";
import chalk from "chalk";
import { RequestId } from "../RequestId";
import { isString, isNumber } from "../../validation/guards";
import * as time from "../../time/time";
import { parseIntStrict, padZero } from "../../number/number";
import * as bytes from "../../bytes/bytes";

export interface RequestLogOptions {
  withColors?: boolean;
}

export class RequestLog {
  protected begin = new Date();
  protected start = performance.now();
  protected end = 0;
  protected uri = "";
  protected method = "";
  protected statusCode = 0;
  protected requestId: RequestId;
  protected httpVersion = "HTTP/";
  protected ipAddr = "";
  protected contentLength = "0";
  protected response: Response;
  protected withColors: boolean;

  constructor(
    request: Request,
    response: Response,
    options: RequestLogOptions = {}
  ) {
    let { withColors = true } = options;
    this.withColors = withColors;

    response.on("finish", this.onFinish);
    this.response = response;
    this.uri = request.originalUrl;
    this.method = request.method;
    this.httpVersion += request.httpVersion;
    this.setIpAddr(request);
    this.requestId = RequestId.extract(request);
  }

  format(): string {
    let { method, uri, httpVersion, ipAddr } = this;
    let statusCode = this.statusCode.toString(10);
    let elapsed = time.stringify(this.end - this.start);
    let size = bytes.format(parseIntStrict(this.contentLength).unwrap_or(-1), {
      useBinary: false,
      precision: 1,
    });
    let dt = this.fmtDate(this.begin);
    let reqId = `[${this.requestId}]`;
    let quote = `"`;

    if (this.withColors) {
      reqId = chalk.yellow(reqId);
      method = chalk.bold(chalk.magenta(method));
      quote = chalk.cyan(quote);
      uri = chalk.cyan(uri);
      httpVersion = chalk.cyan(httpVersion);
      statusCode = chalk.bold(chalk.green(statusCode));
      size = chalk.bold(chalk.blue(size));
      elapsed = chalk.green(elapsed);
    }

    // $date $time [$machine-name/$request-id] "$METHOD $URI $HTTP_VERSION" from $IP_ADDR - $STATUS_CODE $CONTENT_LENGTH in $TIME
    return `${dt} ${reqId} ${quote}${method} ${uri} ${httpVersion}${quote} from ${ipAddr} - ${statusCode} ${size} in ${elapsed}`;
  }

  toString(): string {
    return this.format();
  }

  toJSON(): string {
    return this.format();
  }

  fmtDate(d: Date) {
    let YYYY = d.getFullYear();
    let MM = padZero(d.getMonth() + 1);
    let DD = padZero(d.getDate());

    let hh = padZero(d.getHours());
    let mm = padZero(d.getMinutes());
    let ss = padZero(d.getSeconds());

    return `${YYYY}/${MM}/${DD} ${hh}:${mm}:${ss}`;
  }

  onFinish = () => {
    this.stopTime();
    this.statusCode = this.response.statusCode;
    let contentLength = this.response.getHeader("content-length");
    if (isString(contentLength) || isNumber(contentLength)) {
      this.contentLength = String(contentLength);
    }

    process.stderr.write(this.format() + "\n");
  };

  setIpAddr(request: Request): this {
    // Simplest access from the actual socket.
    let ip = request.connection.remoteAddress;
    // Possible headers for when behind a proxy.
    let xff = request.headers["x-forwarded-for"];
    let realIp = request.headers["x-real-ip"];

    if (Array.isArray(xff)) {
      ip = xff[xff.length - 1];
    } else if (typeof xff === "string") {
      ip = xff;
    } else if (typeof realIp === "string") {
      ip = realIp;
    }

    if (ip) {
      this.ipAddr = ip;
    }

    return this;
  }

  stopTime(): this {
    this.end = performance.now();
    return this;
  }

  static middleware(options?: RequestLogOptions): Handler {
    return function requestLogHandler(req, res, next) {
      new RequestLog(req, res, options);
      next();
    };
  }
}
