export const localsMiddleware = (req, res, next) => {
  //   console.log(req.session);
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  console.log(req.session);
  res.locals.siteName = "wetube"; // base.pug title에 사용
  // console.log(res.locals);
  next();
};

// login 안된 client가 url에다가 직접 users/login or /edit 치게 될 때 template화면에 들어가지니깐 이를 방지
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};
// login 된 client가 url에다가 직접 users/login 치게 될 때 login화면에 들어가지니깐 이를 방지
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
