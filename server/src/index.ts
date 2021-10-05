import express from 'express'
import cors from 'cors'
import { runChecks } from './security/securityChecks'

export const VALID_PARCEL: number[] = [1, 1]

const port = 8080 // default port to listen

const app = express()

app.use(cors({ origin: true }))

app.get('/hello-world', (req: any, res: any) => {
  return res.status(200).send('Hello World!')
})

app.get('/check-validity', async (req: any, res: any) => {
  console.log(req.headers)

  if (await runChecks(req, VALID_PARCEL)) {
    console.log('all good')
    return res.status(200).send({ valid: true, msg: 'Valid request' })
  } else {
    console.log('rejected')
    return res
      .status(400)
      .send({ valid: false, error: 'Can`t validate your request' })
  }
})

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
