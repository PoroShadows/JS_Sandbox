const { createServer } = require('net')
const server = createServer(c => {
    console.log('client connected')
    c.on('end', () => {
        console.log('client disconnected')
    })
    c.write('hello\r\n')
    console.log(c)
    c.pipe(c)
})
server.on('error', err => {
    throw err
})
server.listen(8124, () => {
    console.log('server bound')
})