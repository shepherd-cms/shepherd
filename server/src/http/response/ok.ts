import { ResponseMetadata } from './response.interface';
import { Response, Request } from 'express';

export type OkResponseParams = {
  req?: Request;
  status?: number;
  metadata?: { [k: string]: any };
};

export class OkResponse<T> {
  readonly ok = true;
  status: number;
  data: T;
  metadata: ResponseMetadata;

  constructor(data: T, params: OkResponseParams = {}) {
    let { status = OkResponse.OK, req, metadata } = params;
    this.status = status;
    this.data = data;
    this.metadata = {
      ...metadata,
      datetime: new Date().toISOString(),
      request_url: req && req.originalUrl,
    };
  }

  render(res: Response) {
    let { data, ok, metadata, status } = this;
    res.status(status);
    res.json({ data, metadata, ok });
  }

  static fromData<T>(data: T): OkResponse<T> {
    return new OkResponse(data);
  }

  static NewNoContent(): OkResponse<void> {
    return new OkResponse(undefined, {
      status: OkResponse.NoContent,
    });
  }

  static NewCreated(): OkResponse<void> {
    return new OkResponse(undefined, {
      status: OkResponse.Created,
    });
  }

  //* Information Responses --------------------------------------------------

  /**
   * This interim response indicates that everything so far is OK
   * and that the client should continue with the request or ignore it if it is already finished.
   */
  static get Continue(): 100 {
    return 100;
  }
  /**
   * This code is sent in response to an Upgrade request header by the client,
   * and indicates the protocol the server is switching to.
   */
  static get SwitchingProtocols(): 101 {
    return 101;
  }
  /**
   * [Web-DAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)
   *
   * This code indicates that the server has received and is processing the request,
   * but no response is available yet.
   */
  static get Processing(): 102 {
    return 102;
  }
  /**
   * This status code is primarily intended to be used with the Link header
   * to allow the user agent to start preloading resources
   * while the server is still preparing a response.
   */
  static get EarlyHints(): 103 {
    return 103;
  }

  //* Success Responses ------------------------------------------------------

  /**
   * The request has succeeded.
   * The meaning of a success varies depending on the HTTP method:
   * - GET: The resource has been fetched and is transmitted in the message body.
   * - HEAD: The entity headers are in the message body.
   * - PUT or POST: The resource describing the result of the action is transmitted in the message body.
   * - TRACE: The message body contains the request message as received by the server
   */
  static get OK(): 200 {
    return 200;
  }
  /**
   * The request has succeeded and a new resource has been created as a result of it.
   * This is typically the response sent after a POST request, or after some PUT requests.
   */
  static get Created(): 201 {
    return 201;
  }
  /**
   * The request has been received but not yet acted upon.
   * It is non-committal, meaning that there is no way in HTTP
   * to later send an asynchronous response indicating the outcome of processing the request.
   * It is intended for cases where another process or server handles the request, or for batch processing.
   */
  static get Accepted(): 202 {
    return 202;
  }
  /**
   * This response code means returned meta-information set
   * is not exact set as available from the origin server,
   * but collected from a local or a third party copy.
   * Except this condition, 200 OK response should be preferred instead of this response.
   */
  static get NonAuthoritativeInfo(): 203 {
    return 203;
  }
  /**
   * There is no content to send for this request,
   * but the headers may be useful.
   * The user-agent may update its cached headers for this resource with the new ones.
   */
  static get NoContent(): 204 {
    return 204;
  }
  /**
   * This response code is sent after accomplishing request
   * to tell user agent reset document view which sent this request.
   */
  static get ResetContent(): 205 {
    return 205;
  }
  /**
   * This response code is used because of range header
   * sent by the client to separate download into multiple streams.
   */
  static get PartialContent(): 206 {
    return 206;
  }
  /**
   * [Web-DAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)
   *
   * A Multi-Status response conveys information about
   * multiple resources in situations where multiple status codes might be appropriate.
   */
  static get MultiStatus(): 207 {
    return 207;
  }
  /**
   * [Web-DAV](https://developer.mozilla.org/en-US/docs/Glossary/WebDAV)
   *
   * Used inside a DAV: propstat response element to avoid enumerating
   * the internal members of multiple bindings to the same collection repeatedly.
   */
  static get AlreadyReported(): 208 {
    return 208;
  }
  /**
   * [HTTP Delta Encoding](https://tools.ietf.org/html/rfc3229)
   * The server has fulfilled a GET request for the resource,
   * and the response is a representation of the result of one or more
   * instance-manipulations applied to the current instance.
   */
  static get IMUsed(): 226 {
    return 226;
  }

  //* Redirection Messages ---------------------------------------------------

  /**
   * The request has more than one possible response.
   * The user-agent or user should choose one of them.
   * There is no standardized way of choosing one of the responses.
   */
  static get MultipleChoices(): 300 {
    return 300;
  }
  /**
   * This response code means that the URI of the requested resource has been changed.
   * Probably, the new URI would be given in the response.
   */
  static get MovedPermanently(): 301 {
    return 301;
  }
  /**
   * This response code means that the URI of requested resource has been changed temporarily.
   * New changes in the URI might be made in the future.
   * Therefore, this same URI should be used by the client in future requests.
   */
  static get Found(): 302 {
    return 302;
  }
  /**
   * The server sent this response to direct the client
   * to get the requested resource at another URI with a GET request.
   */
  static get SeeOther(): 303 {
    return 303;
  }
  /**
   * This is used for caching purposes.
   * It tells the client that the response has not been modified,
   * so the client can continue to use the same cached version of the response.
   */
  static get NotModified(): 304 {
    return 304;
  }
  /**
   * **Deprecated 👎**
   * Was defined in a previous version of the HTTP specification
   * to indicate that a requested response must be accessed by a proxy.
   * It has been deprecated due to security concerns regarding in-band configuration of a proxy.
   */
  static get UseProxy(): 305 {
    return 305;
  }
  /**
   * **Unused**
   * This response code is no longer used, it is just reserved currently.
   * It was used in a previous version of the HTTP 1.1 specification.
   */
  static get _(): 306 {
    return 306;
  }
  /**
   * The server sends this response to direct the client
   * to get the requested resource at another URI
   * with same method that was used in the prior request.
   * This has the same semantics as the 302 Found HTTP response code,
   * with the exception that the user agent
   * must not change the HTTP method used:
   * - If a POST was used in the first request,
   *   a POST must be used in the second request.
   */
  static get TemporaryRedirect(): 307 {
    return 307;
  }
  /**
   * This means that the resource is now permanently located at another URI,
   * specified by the Location: HTTP Response header.
   * This has the same semantics as the 301 Moved Permanently HTTP response code,
   * with the exception that the user agent must not change the HTTP method used:
   * - If a POST was used in the first request,
   *   a POST must be used in the second request.
   */
  static get PermanentRedirect(): 308 {
    return 308;
  }
}
