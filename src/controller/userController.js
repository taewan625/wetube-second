import UserModel from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import VideoModel from "../models/Video";
import CommentModel from "../models/Commnet";

export const getJoin = (req, res) =>
  res.render("users/join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
  const { name, email, username, password, conPassword, location } = req.body;
  const pageTitle = "join";
  const usernameExists = await UserModel.exists({ username });
  const emailExists = await UserModel.exists({ email });
  if (usernameExists && emailExists) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMessage: "This username and email are already exists",
    });
  }
  if (usernameExists) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMessage: "This username is already exists",
    });
  }
  if (emailExists) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMessage: "This email is already exists",
    });
  }
  if (password !== conPassword) {
    return res.status(400).render("users/join", {
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
      // avatarUrl: "uploads/avatars/0e1514796f8b7cf93381e6be521cef11",
    });
    return res.redirect("/login");
  } catch (error) {
    res
      .status(404)
      .render("users/join", { pageTitle, errorMessage: error._message });
  }
};

export const getLogin = (req, res) =>
  res.render("users/login", { pageTitle: "Log In" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Log in";
  const user = await UserModel.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("users/login", {
      pageTitle,
      errorMessage: "This ID isn't exists",
    });
  }
  const confirmPassword = await bcrypt.compare(password, user.password);
  if (!confirmPassword) {
    return res.status(400).render("users/login", {
      pageTitle,
      errorMessage: "This Password is wrong",
    });
  }
  //   console.log(req.session);
  // session??? data??? ?????? ?????? = session??? initialize(?????????,??????) ?????? ??????
  req.session.loggedIn = true; //session??? object??? {loggedIn : true} ?????? key-value??? ?????? ???
  req.session.user = user; // session object??? user?????? key??? DB user value??? ??????

  return res.redirect("/");
};

// 1) github??? data ?????? page ??????
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  // ????????? datas
  const config = {
    client_id: process.env.GH_CLIENT,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

// 2) ????????? ???????????? token??????
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  // token??? ???????????? data ?????????
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  // 3) ????????? token?????? client data ??????
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";

    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    // email??? ?????? ?????? ????????? ??????_primary data??? userData from github????????? null????????? ????????????
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    // finding email data from github
    const emailObj = emailData.find(
      (emailParams) =>
        emailParams.primary === true && emailParams.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    // mongodb??? github email??? same email user ?????? ?????? ??????
    let user = await UserModel.findOne({ email: emailObj.email });
    if (!user) {
      user = await UserModel.create({
        name: userData.name,
        email: emailObj.email,
        username: userData.login,
        avatar: userData.avatar_url,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    // need to make user data in db (db.users??? same email??? ?????? ???)
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const logout = (req, res) => {
  // session ?????? ???????????? user data save ??? ??? ?????? ?????? ????????? ??? ??? ??????.
  req.flash("info", "bye bye");
  req.session.destroy();

  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("users/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const pageTitle = "Edit Profile";
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  const usernameExists = await UserModel.exists(
    // ????????? ?????? : _id??? ????????? ??? -> username ?????????.
    { _id: { $nin: [_id] } },
    { username }
  );
  const emailExists = await UserModel.exists(
    { _id: { $nin: [_id] } },
    { email }
  );

  if (usernameExists && emailExists) {
    return res.status(400).render("users/edit-profile", {
      pageTitle,
      errorMessage: "This username and email are already exists",
    });
  }
  if (usernameExists) {
    return res.status(400).render("users/edit-profile", {
      pageTitle,
      errorMessage: "This username is already exists",
    });
  }
  if (emailExists) {
    return res.status(400).render("users/edit-profile", {
      pageTitle,
      errorMessage: "This email is already exists",
    });
  }
  // console.log(file);

  const heroku = process.env.NODE_ENV === "production";

  const updatedUser = await UserModel.findByIdAndUpdate(
    _id,
    {
      // if??? ?????? avatarUrl:file.path?????? file upload?????? ??? .path??? ?????? ??? ????????? error ??????
      avatarUrl: file ? (heroku ? file.location : file.path) : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser; //sessionDB update
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly) return res.redirect("/users/edit");
  // render: wetube/views/FINDING -> wetube/views/users/FINDING | but "/users/change-password" -> wetube/views/FINDING/users/FINDING
  return res.render("users/change-password", {
    pageTitle: "change-password",
  });
};
export const postChangePassword = async (req, res) => {
  const pageTitle = "change-password";
  const {
    session: {
      user: { _id, password },
    },
    body: { prePassword, newPassword, conPassword },
  } = req;

  const confirmPassword = await bcrypt.compare(prePassword, password);
  if (!confirmPassword) {
    return res.status(400).render("users/change-password", {
      pageTitle,
      errorMessage: "Current password is incorrect",
    });
  }
  if (conPassword !== newPassword) {
    return res.status(400).render("users/change-password", {
      errorMessage: "password isn't match",
      pageTitle,
    });
  }
  const user = await UserModel.findByIdAndUpdate(_id);
  user.password = newPassword;
  await user.save(); // mongoose ???????????? pw hash?????? ??????
  req.session.destroy(); // hacker session data ?????? ?????? ??????
  return res.redirect("/login");
};

export const see = async (req, res) => {
  const { id } = req.params;
  // double populate ??????
  const user = await UserModel.findById(id).populate({
    // 1. user profile?????? ?????????????????? user??? videoDB ?????? ????????? ??????
    path: "myVideos",
    // 2. mixin??? ?????????????????? userDB????????? myvideo??? owner??? ????????? ????????? ??????
    populate: {
      path: "owner",
      model: "UserModelName",
    },
  }); // myVideo??? create user??? ??? keyname, ??? key?????? ref ??????
  try {
    return res.render("users/profile", {
      pageTitle: `${user.name}'s profile`,
      user,
    });
  } catch (err) {
    return res
      .status(404)
      .render("404", { pageTitle: "404", errorMessage: err._message });
  }
};

// function??? 2??? ?????????. if social true false ???????????? ????????? ????????????

// local login ??????????????????
export const getDeleteAccount = (req, res) => {
  return res.render("users/delete-account", { pageTitle: "delete-account" });
};

export const postDeleteAccount = async (req, res) => {
  const {
    session: {
      user: { _id, password, socialOnly },
    },
    body: { conPassword },
  } = req;

  const deleteAccount = async (_id) => {
    const user = await UserModel.findById(_id);
    const video = user.myVideos; //array??? string?????? ??????
    video.forEach(
      async (videoId) =>
        await CommentModel.deleteMany({
          $or: [{ owner: _id }, { video: videoId }],
        })
    );
    await VideoModel.deleteMany({ owner: _id }); // ????????? ?????? video ??????
    await UserModel.findByIdAndDelete(_id);
  };

  if (!socialOnly) {
    const confirmPassword = await bcrypt.compare(conPassword, password);
    if (!confirmPassword) {
      return res.status(400).render("users/delete-account", {
        pageTitle: "delete-account",
        errorMessage: "Current password is incorrect",
      });
    }
    deleteAccount(_id);
    req.session.destroy();
    return res.redirect("/");
  }
  deleteAccount(_id);
  req.session.destroy();
  return res.redirect("/");
};
