const express = require('express')
// equivalent to import express from 'express'

//Import data helpers
const db = require('./data/db.js')

//Middleware
const server = express(); // creates as HTTP web server

server.use(express.json()) // teaches express how to parse JSON from the request body

//Endpoints

server.get('/', (req, res) => {
    // Name is not important(could be anything) position is important.
    res.send('Hello World!')
    // .send() is a helper method that is part of the response object.
})

server.get('/now', (req, res) => {
    const d = Date()
    const date = d.toString()
    res.send(date)
})

server.get('/hubs', (req, res) => {
    // .hubs.find() returns a promise that resolves to a list of existing hubs.
    //it fails if the server's clock seconds hold an odd value. Done to simulate failures
    //(ie. fails at 9:00:03 and 9:02:05, succeeds at 9:02:02 and 9:02:08)
    const hubs = db.hubs

    .find()
    .then(hubs => {
        res.status (200).json(hubs)
    })
    .catch(({ code, message }) => {
        res.status(code).json({
            success: false,
            message,
        })
    })
})

server.post('/hubs/', (req, res) => {
    // one way a client can send info is in the request body
    const hubInfo = req.body; // Need to use express.json() middleware

    db.hubs
    .add(hubInfo)
    .then(hub => {
        // hub was added successfully
        res.status(201).json({ success: true, hub })
    })
    .catch(({ code, message  }) => {
        // If we ran into an error adding the hub
        // Notice we are destructuring the error sent back by the data layer.
        res.status(code).json({
            success: false,
            message,
        })
    })
})

server.delete('/hubs/:id', (req, res) => {

    const id = req.params.id

    db.hubs
    .remove(id)
    .then(deleted => {
        // the data layer returns the deleted request, but we can't see it.
        // .end() ends the request and sends a response with the specified status code
        // 204 is (no content) it's commonly used for DELETE as there is no need to send anything back.
        res.status(204).end();
    })
    .catch(({ code, message  }) => {
        res.status(code).json({
            success: false,
            message,
        })
    })
})

server.put('/hub/:id', (req, res) => { 

    const { id } = req.params;
    const changes = req.body;

    db.hubs.update(id, changes)
    .then(updated => {
        if (updated) {
            res.status(200).json({ success: true, updated })
        } else {
            res.status(404).json({
                success: false,
                message: 'Cannot find the hub with the specified ID'
            })
        }
    })
    .catch(({ code, message}) => {
        res.status(code).json({
            success: false,
            message,
       })    
    })
})    

server.get('/hubs/:id', (req, res) => {
    db.hubs.findById(req.params.id)
    .then(hub => {
        if (hub) {
            res.status(200).json({
                success: true,
                hub
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'We cannot find that hub!'
            })
        }
    })
    .catch(({ code, message }) => {
        res.status(code).json({
          success: false,
          message,
        });
      });
});


// makes the web server listen for incoming traffic on port 4000.
server.listen(4000, () => {
    // this callback function runs after thee server starts successfully.
    console.log('/n*** Server running on port 4K ***/n')
})