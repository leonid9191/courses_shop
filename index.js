const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const session = require('express-session');
const MongoStore= require('connect-mongodb-session')(session);
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const MONGODB_URI = `mongodb+srv://leonid0991:ZqbTnTtJHZnA1B5U@cluster0.44zzq.mongodb.net/shop`;

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store // store: store
}))
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 4000

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // const candidate = await User.findOne();
    // if (!candidate){
    //   const user = new User ({
    //     email: 'leonid@mail.com',
    //     name: 'Leonid',
    //     cart: {items: []}
    //   });

    //   await user.save();
    // }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })

  } catch (e) {
    console.log(e);
  }
}

start()

const password = 'ZqbTnTtJHZnA1B5U'