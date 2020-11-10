module.exports = function (app, mysql) {
    const passport = require('passport')
    const LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());
// 로그인 성공
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
// 이후 페이지 방문
    passport.deserializeUser(function (id, done) {
        mysql.query(
            "SELECT * from user WHERE id=?",
            [id],
            function (error, results, fields) {
                done(error, results[0])
            })

    });

    passport.use(new LocalStrategy(
        function (username, password, done) {
            mysql.query(
                "SELECT id, pw from user WHERE id=?",
                [username],
                function (error, results, fields) {
                    const user = results[0]
                    if (error) // 데이터베이스 오류
                        return done(error)
                    if (user) {
                        if (user.pw === password) // 로그인
                            return done(null, user)
                        else // 비밀번호 오류
                            return done(null, false)
                    } else // 아이디 오류
                        return done(null, false)
                })
        }
    ))
    return passport
}