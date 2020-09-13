const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/FileServer.db');

module.exports = function(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        //console.log(user);
        done(null, user.USERID);
    });

    passport.deserializeUser((id, done) => {
        //console.log(id);
        db.get(" SELECT * FROM USERINFO WHERE USERID = $id", {
            $id: id
        }, (err, row) => {
            if (err) {
                return done(err);
            }
            //console.log(row);
            done(null, row)
        });
     });
    // let a = 'admin';
    // db.all("SELECT * FROM USERINFO WHERE Username = $a", (err, rows) => {
    //     console.log(rows);
    // });
    
    passport.use(
        new LocalStrategy(function(username, password, done) {
            db.all("SELECT * FROM USERINFO WHERE Username = $username", {
                $username: username
            }, (err, rows) => {
                if (err) {
                    return done(err);
                }
                if (rows.length === 0) {
                    return done(null, false);
                }
                rows.forEach(obj => {
                    if (!bcrypt.compareSync(password, obj.Password)) {
                        return done(null, false);
                    } else {
                        //console.log(1234567890);
                        return done(null, obj);
                    }
                })
            });
        })
    );
};