import { SMTPServer } from 'smtp-server'
import dotenv from 'dotenv'

dotenv.config()

const server = new SMTPServer()

const port = process.env.SMTP_PORT



server.listen(port, `localhost`, () => console.log(`SERVER LISTENING AT PORT ${port}`))