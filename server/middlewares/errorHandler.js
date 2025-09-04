const expressErrorHandler = (err, req, res, next) => {
  const errorMessage = err.message;
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      errorCode: err.code || "SERVER_ERROR",
      details: err.details || null,
    },
  });
};

export default expressErrorHandler;
