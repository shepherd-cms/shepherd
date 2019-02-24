import { ResponseMetadata, HttpSender } from "./response.interface";
import { Response, Request } from "express";
import { requestKeys } from "../constants";

export interface ErrorResponseParams {
  req?: Request;
  status?: number;
  error?: string;
  metadata?: { [k: string]: any };
}

export class ErrorResponse implements HttpSender {
  readonly ok = false;
  status: number;
  error: string;
  metadata: ResponseMetadata;

  /**
   * We just want to require the raw error data.
   * This get constructed potentially deep inside a controller.
   */
  constructor(params: ErrorResponseParams) {
    let {
      status = ErrorResponse.BadRequest,
      error = "Bad Request",
      req,
      metadata,
    } = params;

    this.error = error;
    this.status = status;
    this.metadata = {
      ...metadata,
      datetime: new Date().toISOString(),
      request_url: req && req.originalUrl,
    };
  }

  /**
   * Router call should this.
   */
  send(res: Response) {
    let { error, metadata, ok, status } = this;
    res.status(status);
    res.json({
      ok,
      error,
      metadata: {
        ...metadata,
        // @ts-ignore
        requestId: res[requestKeys.requestId],
      },
    });
  }

  static NewInternalServerError(req?: Request): ErrorResponse {
    return new ErrorResponse({
      error: `Internal Server Error`,
      req,
      status: ErrorResponse.InternalServerError,
    });
  }

  static NewNotFoundError(req?: Request): ErrorResponse {
    return new ErrorResponse({
      error: `Not Found`,
      req,
      status: ErrorResponse.NotFound,
    });
  }

  static NewUnauthorizedError(req?: Request): ErrorResponse {
    return new ErrorResponse({
      error: `Unauthorized`,
      req,
      status: ErrorResponse.Unauthorized,
    });
  }

  //* Client Error Responses -------------------------------------------------

  /**
   * This response means that server could not understand
   * the request due to invalid syntax.
   */
  static get BadRequest(): 400 {
    return 400;
  }
  /**
   * Although the HTTP standard specifies "unauthorized",
   * semantically this response means "unauthenticated".
   * That is, the client must authenticate itself to get the requested response.
   */
  static get Unauthorized(): 401 {
    return 401;
  }
  /**
   * This response code is reserved for future use.
   * Initial aim for creating this code was using it
   * for digital payment systems however this is not used currently.
   */
  static get PaymentRequired(): 402 {
    return 402;
  }
  /**
   * The client does not have access rights to the content,
   * i.e. they are unauthorized, so server is rejecting to give proper response.
   * Unlike 401, the client's identity is known to the server.
   */
  static get Forbidden(): 403 {
    return 403;
  }
  /**
   * The server can not find requested resource.
   * In the browser, this means the URL is not recognized.
   * In an API, this can also mean that the endpoint is valid
   * but the resource itself does not exist.
   * Servers may also send this response instead of 403
   * to hide the existence of a resource from an unauthorized client.
   */
  static get NotFound(): 404 {
    return 404;
  }
  /**
   * The request method is known by the server,
   * but has been disabled and cannot be used.
   * For example, an API may forbid DELETE-ing a resource.
   * The two mandatory methods, GET and HEAD,
   * must never be disabled and should not return this error code.
   */
  static get MethodNotAllowed(): 405 {
    return 405;
  }
  /**
   * This response is sent when the web server,
   * after performing [server-driven content negotiation](https://developer.mozilla.org/en-US/docs/HTTP/Content_negotiation#Server-driven_negotiation),
   * doesn't find any content following the criteria given by the user agent.
   */
  static get NotAcceptable(): 406 {
    return 406;
  }
  /**
   * This is similar to 401,
   * but authentication is needed to be done by a proxy.
   */
  static get ProxyAuthRequired(): 407 {
    return 407;
  }
  /**
   * This response is sent on an idle connection by some servers,
   * even without any previous request by the client.
   * It means that the server would like to shut down this unused connection.
   * This response is used much more since some browsers,
   * like Chrome, Firefox 27+, or IE9,
   * use HTTP pre-connection mechanisms to speed up surfing.
   * Also note that some servers merely shut down the connection
   * without sending this message.
   */
  static get RequestTimeout(): 408 {
    return 408;
  }
  /**
   * This response is sent when a request conflicts
   * with the current state of the server.
   */
  static get Conflict(): 409 {
    return 409;
  }
  /**
   * This response would be sent when the requested content
   * has been permanently deleted from server,
   * with no forwarding address.
   * Clients are expected to remove their caches and links to the resource.
   * The HTTP specification intends this status code to be used
   * for "limited-time, promotional services".
   * APIs should not feel compelled to indicate resources
   * that have been deleted with this status code.
   */
  static get Gone(): 410 {
    return 410;
  }
  /**
   * Server rejected the request because the Content-Length header field
   * is not defined and the server requires it.
   */
  static get LengthRequired(): 411 {
    return 411;
  }
  /**
   * The client has indicated preconditions in its headers
   * which the server does not meet.
   */
  static get PreconditionFailed(): 412 {
    return 412;
  }
  /**
   * Request entity is larger than limits defined by server;
   * the server might close the connection
   * or return an `Retry-After` header field.
   */
  static get RequestEntityTooLarge(): 413 {
    return 413;
  }
  /**
   * The URI requested by the client is longer than the server is willing to interpret.
   */
  static get RequestURITooLong(): 414 {
    return 414;
  }
  /**
   * The media format of the requested data is not supported by the server,
   * so the server is rejecting the request.
   */
  static get UnsupportedMediaType(): 415 {
    return 415;
  }
  /**
   * The range specified by the `Range` header field
   * in the request can't be fulfilled;
   * it's possible that the range is outside the size of the target URI's data.
   */
  static get RequestedRangeNotSatisfiable(): 416 {
    return 416;
  }
  /**
   * This response code means the expectation indicated by the
   * `Expect` request header field can't be met by the server.
   */
  static get ExpectationFailed(): 417 {
    return 417;
  }
  /**
   * The server refuses the attempt to brew coffee with a teapot.
   */
  static get Teapot(): 418 {
    return 418;
  }
  /**
   * The request was directed at a server that is not able to produce a response.
   * This can be sent by a server that is not configured
   * to produce responses for the combination of scheme and authority
   * that are included in the request URI.
   */
  static get MisdirectedRequest(): 421 {
    return 421;
  }
  /**
   * [Web-DAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)
   *
   * The request was well-formed,
   * but was unable to be followed due to semantic errors.
   */
  static get UnprocessableEntity(): 422 {
    return 422;
  }
  /**
   * [Web-DAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)
   *
   * The resource that is being accessed is locked.
   */
  static get Locked(): 423 {
    return 423;
  }
  /**
   * [Web-DAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)
   *
   * The request failed due to failure of a previous request.
   */
  static get FailedDependency(): 424 {
    return 424;
  }
  /**
   * Indicates that the server is unwilling
   * to risk processing a request that might be replayed.
   */
  static get TooEarly(): 425 {
    return 425;
  }
  /**
   * The server refuses to perform the request using the current protocol,
   * but might be willing to do so after the client upgrades to a different protocol.
   * The server sends an Upgrade header in a 426 response to indicate the required protocol(s).
   */
  static get UpgradeRequired(): 426 {
    return 426;
  }
  /**
   * The origin server requires the request to be conditional.
   * Intended to prevent the 'lost update' problem,
   * where a client GETs a resource's state, modifies it,
   * and PUTs it back to the server,
   * when meanwhile a third party has modified the state on the server,
   * leading to a conflict.
   */
  static get PreconditionRequired(): 428 {
    return 428;
  }
  /**
   * The user has sent too many requests in a given amount of time ("rate limiting").
   */
  static get TooManyRequests(): 429 {
    return 429;
  }
  /**
   * The server is unwilling to process the request
   * because its header fields are too large.
   * The request MAY be resubmitted after reducing
   * the size of the request header fields.
   */
  static get RequestHeaderFieldsTooLarge(): 431 {
    return 431;
  }
  /**
   * The user requests an illegal resource,
   * such as a web page censored by a government.
   */
  static get UnavailableForLegalReasons(): 451 {
    return 451;
  }

  //* Server Error Responses -------------------------------------------------

  /**
   * The server has encountered a situation it doesn't know how to handle.
   */
  static get InternalServerError(): 500 {
    return 500;
  }
  /**
   * The request method is not supported by the server and cannot be handled.
   * The only methods that servers are required to support
   * (and therefore that must not return this code) are GET and HEAD.
   */
  static get NotImplemented(): 501 {
    return 501;
  }
  /**
   * This error response means that the server,
   * while working as a gateway to get a response needed to handle the request,
   * got an invalid response.
   */
  static get BadGateway(): 502 {
    return 502;
  }
  /**
   * The server is not ready to handle the request.
   * Common causes are a server that is down for maintenance or that is overloaded.
   * Note that together with this response,
   * a user-friendly page explaining the problem should be sent.
   * This responses should be used for temporary conditions and the `Retry-After`:
   * HTTP header should, if possible,
   * contain the estimated time before the recovery of the service.
   * The webmaster must also take care about
   * the caching-related headers that are sent along with this response,
   * as these temporary condition responses should usually not be cached.
   */
  static get ServiceUnavailable(): 503 {
    return 503;
  }
  /**
   * This error response is given when the server
   * is acting as a gateway and cannot get a response in time.
   */
  static get GatewayTimeout(): 504 {
    return 504;
  }
  /**
   * The HTTP version used in the request is not supported by the server.
   */
  static get HTTPVersionNotSupported(): 505 {
    return 505;
  }
  /**
   * The server has an internal configuration error:
   * transparent content negotiation for the request
   * results in a circular reference.
   */
  static get VariantAlsoNegotiates(): 506 {
    return 506;
  }
  /**
   * The server has an internal configuration error:
   * the chosen variant resource is configured
   * to engage in transparent content negotiation itself,
   * and is therefore not a proper end point in the negotiation process.
   */
  static get InsufficientStorage(): 507 {
    return 507;
  }
  /**
   * [Web-DAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)
   *
   * The server detected an infinite loop while processing the request.
   */
  static get LoopDetected(): 508 {
    return 508;
  }
  /**
   * Further extensions to the request are required for the server to fulfill it.
   */
  static get NotExtended(): 510 {
    return 510;
  }
  /**
   * The 511 status code indicates that the client needs to authenticate to gain network access.
   */
  static get NetworkAuthenticationRequired(): 511 {
    return 511;
  }
}
