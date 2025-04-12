const wrapAsync = (fn) => (req, res, next) => {
  try {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  } catch (error) {
    next(error);
  }
};

export default wrapAsync;
