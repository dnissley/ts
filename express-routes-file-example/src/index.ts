import express from 'express'
import configureRoutes from 'express-routes-file'

const app = express()

const routes = configureRoutes({
  hello: (req, res) => res.send('hello world'),
  hi: (req, res) => res.send('hi world')
})

app.use('/', routes)

app.listen(3000, () => console.log('listening on port 3000'))
