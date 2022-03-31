const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');

const app = express()



app.set('view engine', 'html');
app.set('views', `${__dirname}/views`);
app.engine('html', require('ejs').renderFile);


app.all('*',function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
})

app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: false}));


app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./router/home'))
app.use('/', require('./router/result'))

const server = app.listen(3000, function() {
	console.log("server start at localhost:3000");
})

