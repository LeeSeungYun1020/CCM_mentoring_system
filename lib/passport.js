module.exports = function (app/*, db*/) {
    const passport = require('passport')
    const LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());
// 로그인 성공
    passport.serializeUser(function (user, done) {
        done(null, user.username);
    });
// 이후 페이지 방문
    passport.deserializeUser(function (id, done) {
        // 데이터베이스에서 조회
        // User.findById(id, function(err, user) {
        //   done(err, user);
        // });
        done({msg: "아직 데이터베이스 조회 구현 안됨"}, null)
    });
// 로그인 확인
    passport.use(new LocalStrategy(
        function (username, password, done) {
            console.log(username + " " + password)
            // User.findOne({ username: username }, function (err, user) {
            //   if (err) { return done(err); }
            //   if (!user) {
            //     return done(null, false, { message: 'Incorrect username.' });
            //   }
            //   if (!user.validPassword(password)) {
            //     return done(null, false, { message: 'Incorrect password.' });
            //   }
            //   return done(null, user);
            // });
            // user는 데이터베이스에서 조회

            return done(null, {username: username, password: password})
        }
    ))
    return passport
}