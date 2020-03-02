const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort("COM3", { baudRate: 9600 })

const parser = new Readline({ delimiter: '\n' })
port.pipe(parser)

parser.on('data', line => console.log(`> ${line}`))

var rgb = {"r":0,"g":255,"b":255};
setInterval(() => port.write(JSON.stringify(rgb) + '\n'), 2000)