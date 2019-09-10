var express = require('express')
var config = require('./config/index.js')

var port = process.env.PORT || config.build.port

var app = express()

var router = express.Router()
router.get('/', function (req,res,next) {
  req.url = '/index.html'
  next()
})
app.use(router)

const appData = require('./data.json')
const seller = appData.seller
const goods = appData.goods
const ratings = appData.ratings

var apiRouters = express.Router()
apiRouters.get('/api/seller', (req, res) => {
  res.json({
    errno: 0,
    data: seller
  })
})
apiRouters.get('/api/goods', (req, res) => {
  res.json({
    errno: 0,
    data: goods
  })
})
apiRouters.get('/api/ratings', (req, res) => {
  res.json({
    errno: 0,
    data: ratings
  })
})
app.use('/api', apiRouters)
app.use(express.static('./dist'))
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listen at http://localhost:' + port + '\n')
})
