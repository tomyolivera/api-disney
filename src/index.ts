import { config } from 'dotenv'
config()

import app from './app'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.clear()
    console.log(`Port: ${PORT}`)
})