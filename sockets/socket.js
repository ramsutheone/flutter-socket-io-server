const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');
const bands = new Bands();
//console.log('init server');

bands.addBand(new Band('Souls Assasins'));
bands.addBand(new Band('Cypress Hill'));
bands.addBand(new Band('Otra banda'));
bands.addBand(new Band('the lox'));
bands.addBand(new Band('Metallica'));

//console.log(bands);

//Mensajes de sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    client.emit('bandasActivas', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente Desonectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);
        io.emit('mensaje', { admin: 'Nuevo Mensaje' });
    });

    client.on('vote-band', (payload) => {
        //console.log(payload);
        bands.voteBand(payload.id);
        io.emit('bandasActivas', bands.getBands());

    });

    client.on('add-band', (payload) => {
        const NewBand = new Band(payload.name);
        bands.addBand(NewBand);
        io.emit('bandasActivas', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('bandasActivas', bands.getBands());
    });
    //git push heroku HEAD:master
    //https://sockets-server-ram.herokuapp.com
    /*
        client.on('other-msg', (payload) => {
            //console.log('Mensaje', payload);

            //io.emit('other-msg', payload); //esto emite a TODOS!!!
            client.broadcast.emit('mensaje-cliente-broadcast', payload); //esto emite a todos MENOS al que lo EMITE!!!
        });

    */

});