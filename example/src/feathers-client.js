import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import reactive from 'feathers-reactive'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { CookieStorage } from 'cookie-storage'

// Connecting to a Kadabra server, see npm package @kadabra/server
const socket = io('http://localhost:7777', {transports: ['websocket']})

export const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(auth({ storage: new CookieStorage() }))
  .configure(reactive({idField:'_id'}))

export default feathersClient
