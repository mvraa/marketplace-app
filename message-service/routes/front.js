const express = require('express');
const router = express.Router();
var amqp = require('amqplib/callback_api');

const rabbitmqConfig = {
    protocol: 'amqp',
    hostname: 'rabbit-server',
    username: 'guest',
    password: 'guest',
    port: 5672,
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL'],

};

// Home page route
router.get('/', async (req, res) => {
    res.render('index');
});

// GET - Product details
router.post('/test', async (req, res) => {
    console.log(rabbitmqConfig);
    amqp.connect(rabbitmqConfig, function(error0, connection) {
        if (error0) {
            throw error0;
        }

        // create a channel - this is where most of the API for getting things done resides:
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            // declare a queue and dummy message
            // sevice complains if we try to send to 
            // a default queue created using the rabbitmq gui
            var queue = 'myq3'; 
            var msg = 'Hello World!';

            // create queue if it doesn't already exist
            channel.assertQueue(queue, {
                durable: false
            });
            // send message to queue
            channel.sendToQueue(queue, Buffer.from(msg));

            console.log(" [x] Sent %s", msg);
        });
        // close the connection and exit
        setTimeout(function() {
            connection.close();
            process.exit(0);
        }, 500);
    });

    res.redirect('/');
});

module.exports = router;