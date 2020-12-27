/* eslint-disable no-undef */
const express = require('express');
const morgan = require('morgan');

const app = express();
//this is middleware that requests pass through
//on their way to the final handler
app.use(morgan('dev'));

//this is the final request handler
app.get('/', (req, res) => {
    console.log('the root path was called');
    res.send('hello express!');
});

app.listen(8000, () => {
    console.log('express erver is listening on port 8000!');
})

app.get('/burger', (req, res) => {
    res.send('we have juicy cheese burgers!');
})

app.get('/pizza/peperoni', (req, res) => {
    res.send('your pizza is on the way!');
})

app.get('/pizza/pineapple', (req, res) => {
    res.send('we dont\' serve that here. never call again!');
})

app.get('/echo', (req, res) => {
    const responseText = `here are some details of your request:
    Base URL : ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
    `;
    res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end(); //do not send any data back to the client
})

app.get('/greetings' , (req, res) => {
    //1. get values from the request
    const name = req.query.name;
    const race= req.query.race;

    //2. validate the values
    if(!name){
        //3. name was not provided
        return res.status(400).send('please provide a name');
    }
    if(!race){
        //3. race was not provided
        return res.status(400).send('please provide a race')
    }
    //4/5 both name and race are valid so do the processing!
    const greeting = `Welcome ${name} the ${race}!!`
    //6. send the response
    res.send(greeting);
})

//q1.
app.get('/sum', (req, res) => {
    const a = req.query.a;
    const b = req.query.b;

    if(!a){
        return res.status(400).send('please type a');
    }
    if(!b){
        return res.status(400).send('please type b');
    }

    const A = parseFloat(a);
    const B = parseFloat(b);

    if(Number.isNaN(A)){
        return res.status(400).send('type number');
    }
    if(Number.isNaN(B)){
        return res.status(400).send('type number');
    }
    
    const c = A + B;
    res.send(`The sum of ${a} and ${b} is ${c}`);
})