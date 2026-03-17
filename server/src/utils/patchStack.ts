const _captureStackTrace = Error.captureStackTrace;
Error.captureStackTrace = (target: any, ...args: []) => {
  if (target?.stack) return;
  return _captureStackTrace(target, ...args);
};
