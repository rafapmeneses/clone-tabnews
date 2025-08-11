import { InternalServerError, MethodNotAllowedError } from "infra/errors";

export function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

export function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}
