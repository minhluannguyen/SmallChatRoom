const passport = require('passport');
const bcrypt = require("bcrypt");
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/FileServer.db');

module.exports = function(app) {
    function ensureAuthenticated(req, res, next) {
        //console.log(req.isAuthenticated);
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/");
    }

    app.route("/").get((req, res) => {
        res.render(process.cwd() + "/views/pug/index");
    });

    app.route("/login").post(passport.authenticate('local', {failureRedirect: '/'}), (req, res) => {
        res.redirect('/chat');
    });

    app.route("/chat").get(ensureAuthenticated, (req, res) => {
        //console.log(req.session);
        res.render(process.cwd() + "/views/pug/chat", { user: req.user });
    });

    app.route("/signin").get( (req, res) => {
        res.render(process.cwd() + "/views/pug/register");
    });

    app.route('/register')
    .post( (req, res, next) => {
        db.all(" SELECT * FROM USERINFO WHERE Username = $username", {
            $username: req.body.username
        }, (err, rows) => {
            if (err) {
                next(err);
            } else if (rows.length > 0) {
                res.redirect('/');
            } else {
                var hash = bcrypt.hashSync(req.body.password, 12);
                db.get("INSERT INTO USERINFO(Username, Password) VALUES($username, $pass)", {
                    $username: req.body.username,
                    $pass: hash
                }, (err, row) => {
                    if (err) {
                        res.redirect('/');
                    } else {
                        next(null, row)
                    }
                });
            }
        });
    },
        passport.authenticate('local', {failureRedirect: '/'}), 
        (req, res) => {
            res.redirect('/chat');
        }
    );

    app.route("/logout").get((req, res) => {
        req.logout();
        res.redirect("/");
    });

    app.use((req, res, next) => {
        res.status(404).type("text").send("Not Found");
    });
}