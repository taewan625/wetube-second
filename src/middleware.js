export const localsMiddleware = (req, res, next) => {
  //   console.log(req.session);
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  console.log(req.session);
  res.locals.siteName = "wetube"; // base.pug title에 사용
  // console.log(res.locals);
  next();
};
