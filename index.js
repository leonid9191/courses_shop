const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const session = require('express-session');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('60bdf9a6f6a3152998a0e87b')
    req.user = user
    next()
  } catch (e) {
    console.log(e)
  }
});

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false
}))
app.use(varMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000

async function start() {
  try {
    const url = `mongodb+srv://leonid0991:ZqbTnTtJHZnA1B5U@cluster0.44zzq.mongodb.net/shop`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const candidate = await User.findOne();
    if (!candidate){
      const user = new User ({
        email: 'leonid@mail.com',
        name: 'Leonid',
        cart: {items: []}
      });

      await user.save();
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })

  } catch (e) {
    console.log(e);
  }
}

start()

const password = 'ZqbTnTtJHZnA1B5U'