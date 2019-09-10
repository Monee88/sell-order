import Vue from 'vue'
import VueRouter from 'vue-router'


const appData = require('../data.json')
const seller = appData.seller
const goods = appData.goods
const ratings = appData.ratings

apiRoutes.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  })
})
apiRoutes.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  })
})
apiRoutes.get('/ratings', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  })
})
app.use('/api', apiRoutes)
