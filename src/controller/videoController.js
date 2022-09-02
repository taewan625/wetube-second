export const trending = (req, res) => res.send("Home page");
export const see = (req, res) => {
  console.log(req.params); // :id 이므로 id: "params" 로 나옴
  return res.send(`watch video ${req.params.id}`);
};
export const edit = (req, res) => res.send("edit");
export const search = (req, res) => res.send("search");
export const upload = (req, res) => res.send("upload");
export const deleteVideo = (req, res) => res.send("deleteVideo");
