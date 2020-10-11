# redux-socket [wip]
Utility for Synchronising Redux states across multiple clients with websockets.

## Scratch notes...
### Middleware
#### Server
- receives event over ws
- updates state
- broadcasts state to all clients

### Client
#### receive
- receives event over ws
- ensures is next in event counter
    - if not, requests states that are missed (does not update state w/out previous updates)
    - if counter is X steps out of sync, just fetch full state from server
- updates state
#### dispatch
- action happens
- local state updated
- action dispatched to server


## utils
- client request state
- client disconnected
- implicit client disconnected
- load state from server or client
- force update clients
- repair state from missed message(s)
