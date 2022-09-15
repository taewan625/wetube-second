import userModel from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, email, username, password, location } = req.body;
  await userModel.create({
    name,
    email,
    username,
    password,
    location,
  });
  return res.redirect("/login");
};
export const getLogin = (req, res) => res.send("준비중");
export const postLogin = (req, res) => res.send("준비중");
export const edit = (req, res) => res.send("edit");
export const remove = (req, res) => res.send("delete");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see");
