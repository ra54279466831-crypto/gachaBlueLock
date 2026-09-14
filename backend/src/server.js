import 'dotenv/config.js'
import express from 'express'
import cors from 'cors'
import addRoutes from './router'

const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use(cors())
addRoutes(app)

app.listen(PORT, () => {
    console.log(`---> API rodando na porta ${PORT}`)
})