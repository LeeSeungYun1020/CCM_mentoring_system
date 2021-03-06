const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const sessionMySQLStore = require('express-mysql-session')(session)
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const flash = require('connect-flash')
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))
app.use(express.static(path.join(__dirname, 'node_modules')))
const sessionStore = new sessionMySQLStore({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'lsy1020',
  database: 'session'
})

app.use(session({
  key: 'session_cookie_name',
  secret: 'S)e(s*s&i^o%n$P#a@s!s`w~o-r=d',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
const mysql = require('./lib/mysql.js')

const passport = require('./lib/passport.js')(app, mysql)

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')(passport)
const boardRouter = require('./routes/board')(passport)
const editRouter = require('./routes/edit')(passport)
const searchRouter = require('./routes/search')(passport)
const mentorRouter = require('./routes/mentor')(passport)

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/board', boardRouter)
app.use('/edit', editRouter)
app.use('/search', searchRouter)
app.use('/mentor', mentorRouter)
app.get('/*.html', (req, res) => {
    res.render(req.params[0] + '.html')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app


