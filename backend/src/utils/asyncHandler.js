/**
 * A utility function that wraps asynchronous route handlers to catch errors.
 * This avoids writing try-catch blocks in every controller.
 * @param {Function} requestHandler - The asynchronous controller function.
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };