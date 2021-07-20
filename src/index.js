import { SMTPServer } from 'smtp-server'

const server = new SMTPServer()

server.listen(465)