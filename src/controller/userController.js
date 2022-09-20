import UserModel from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import session from "express-session";

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
  // session에 data를 넣는 과정 = session이 initialize(초기화,수정) 되는 부분
  req.session.loggedIn = true; //session의 object에 {loggedIn : true} 라는 key-value를 넣는 것
  req.session.user = user; // session object에 user라는 key에 DB user value를 넣음

  return res.redirect("/");
};

// 1) github에 data 승인 page 연결
export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  // 승인할 datas
  const config = {
    client_id: process.env.GH_CLIENT,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

// 2) 승인이 완료되고 token받기
export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  // token을 받기위한 data 준비물
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

  // 3) 받아온 token으로 client data 추출
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

    // email에 관한 정보 가지고 오기_primary data는 userData from github에서는 null값으로 나오므로
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
    // mongodb에 github email과 same email user 존재 여부 확인
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
    // need to make user data in db (db.users에 same email이 없을 때)
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const logout = (req, res) => {
  // session 값만 없애야지 user data save 할 수 있고 다시 로그인 할 수 있다.
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
      user: { _id },
    },
    body: { name, email, username, location },
    file,
  } = req;
  console.log(file);
  const usernameExists = await UserModel.exists(
    // 순서도 중요 : _id를 제외한 후 -> username 찾는다.
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

  const updatedUser = await UserModel.findByIdAndUpdate(
    _id,
    { name, email, username, location },
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
  await user.save(); // mongoose 문법으로 pw hash하기 위함
  req.session.destroy(); // hacker session data 이용 방지 목적
  return res.redirect("/login");
};

export const see = (req, res) => res.send("see");
