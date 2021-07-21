import { SMTPServer } from 'smtp-server'
import dotenv from 'dotenv'

dotenv.config()

const server = new SMTPServer({
    // log to console
    logger: true,
    secure: false,

    // not required but nice-to-have
    banner: 'Welcome to My Awesome SMTP Server',

    // disable STARTTLS to allow authentication in clear text mode
    disabledCommands: [ 'STARTTLS'],

    // By default only PLAIN and LOGIN are enabled
    authMethods: ['PLAIN', 'LOGIN', 'CRAM-MD5'],

    // Accept messages up to 10 MB
    size: 10 * 1024 * 1024,

    // allow overriding connection properties. Only makes sense behind proxy
    useXClient: true,

    hidePIPELINING: true,

    // use logging of proxied client data. Only makes sense behind proxy
    useXForward: true,

    onAuth(auth, session, callback) {
        let username = 'testuser';
        let password = 'testpass';

        // check username and password
        if (
            auth.username === username &&
            (auth.method === 'CRAM-MD5'
                ? auth.validatePassword(password) // if cram-md5, validate challenge response
                : auth.password === password) // for other methods match plaintext passwords
        ) {
            return callback(null, {
                user: 'userdata' // value could be an user id, or an user object etc. This value can be accessed from session.user afterwards
            });
        }

        return callback(new Error('Authentication failed'));
    },
    onConnect: function(session, callback) {
        console.log("onConnect : " + session.remoteAddress);
        console.log("sonMailFromession : " + session.clientHostname);
        console.log('session.hostNameAppearsAs : ' + session.hostNameAppearsAs);
        return callback(); //Accept the connection
    },
    onMailFrom: function(address, session, callback) {
        console.log('onMailFrom : ' + address.address);
        return callback(); //Accept the address
    },
    onRcptTo: function(address, session, callback) {
        console.log('onRcptTo : ' + address.address);
        return callback();//Accept the address
    },
    onData: function(stream, session, callback) {
        stream.pipe(process.stdout); //print message to console
        stream.on('end', function() {
            callback(null, 'message end');
        });
    }
})

server.on(`error`, (e) =>
{
    console.log(`something wrong happened!`, e.message)
})

const port = process.env.SMTP_PORT



server.listen(port, `localhost`, () => console.log(`SERVER LISTENING AT PORT ${port}`))