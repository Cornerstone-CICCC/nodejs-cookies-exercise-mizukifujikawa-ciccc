import { Router, Request, Response } from "express";
import { checkAuth } from "../middleware/auth.middleware";
import { User } from "../types/user.td";

const pageRouter = Router();

const users: User[] = [{ id: 1, username: "admin", password: "admin12345" }];

/**
 * Displays the home page
 *
 * @route GET /
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Renders the home page.
 */
pageRouter.get("/", (req: Request, res: Response) => {
  res.status(200).render("index");
});

/**
 * Displays login form
 *
 * @route GET /login
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Renders a page with a login form.
 */
pageRouter.get("/login", (req: Request, res: Response) => {
  res.status(200).render("login");
});

/**
 * Login user with login details
 *
 * @route POST /login
 * @param {Request<{}, {}, Omit<User, 'id'>>} req
 * @param {Response} res
 * @returns {void} Responds with a cookie and redirect.
 */
pageRouter.post("/login", (req: Request<{}, {}, Omit<User, "id">>, res: Response) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    res.status(404).redirect("/login");
    return;
  }
  res.cookie("isLoggedIn", true, {
    maxAge: 5 * 60 * 1000, // 5 minutes
    httpOnly: true,
    signed: true, // Cookie is stored in signedCookies obj
  });
  res.cookie("username", username, {
    maxAge: 5 * 60 * 1000, // 5 minutes
    httpOnly: true,
    signed: true,
  });

  res.status(200).redirect("/profile");
});

/**
 * Get username from cookie
 *
 * @route GET /check
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Responds with username object.
 */
pageRouter.get("/profile", checkAuth, (req: Request, res: Response) => {
  const { username } = req.signedCookies;
  res.status(200).render("profile", { username });
});

export default pageRouter;