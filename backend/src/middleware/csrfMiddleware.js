import csrf from 'csurf';
import cookieParser from 'cookie-parser';

const csrfProtection = csrf({ cookie: true });

const csrfToken = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

export { csrfProtection, cookieParser, csrfToken };
