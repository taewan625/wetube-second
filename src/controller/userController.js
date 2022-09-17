import UserModel from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  const { name, email, username, password, conPassword, location } = req.body;
  console.log(req.body);
  const pageTitle = "join";
  const usernameExists = await UserModel.exists({ username });
  const emailExists = await UserModel.exists({ email });
  if (usernameExists && emailExists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username and email are already exists",
    });
  }
  if (usernameExists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username is already exists",
    });
  }
  if (emailExists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This email is already exists",
    });
  }
  if (password !== conPassword) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This password isn't same.",
    });
  }
  try {
    await UserModel.create({
      name,
      email,
      username,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    res.status(404).render("join", { pageTitle, errorMessage: error._message });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Log in";
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "This ID isn't exists",
    });
  }
  const confirmPassword = await bcrypt.compare(password, user.password);
  if (!confirmPassword) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "This Password is wrong" });
  }
  //   console.log(req.session);
  // session에 data를 넣는 과정 = session이 initialize(초기화,수정) 되는 부분
  req.session.loggedIn = true; //session의 object에 {loggedIn : true} 라는 key-value를 넣는 것
  req.session.user = user; // session object에 user라는 key에 DB user value를 넣음

  return res.redirect("/");
};
export const edit = (req, res) => res.send("edit");
export const remove = (req, res) => res.send("delete");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see");
