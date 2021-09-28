import { authenticateUsingAuthChain } from './authenticate'
import * as functions from 'firebase-functions'
import * as express from 'express'
//import cors from 'cors'

//const functions = require('firebase-functions')
// const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({ origin: true }))

app.get('/hello-world', (req: any, res: any) => {
  return res.status(200).send('Hello World!')
})

app.get('/check-legit', async (req: any, res: any) => {
  console.log(req.headers)
  let check = await authenticateUsingAuthChain(req)

  if (check) {
    console.log('all good')
    return res.status(200).send({ legit: true, msg: 'Your`re OK' })
  } else {
    console.log('rejected')
    return res
      .status(200)
      .send({ legit: false, msg: 'We caught you in the act!' })
  }
})

exports.app = functions.https.onRequest(app)
