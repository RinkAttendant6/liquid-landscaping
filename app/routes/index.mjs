import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

router.get("/profile", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("profile", { user: req.user || null });
    } else {
        res.redirect("/login");
    }
});

export default router;
