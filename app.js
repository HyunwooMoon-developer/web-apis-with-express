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

//q2.

app.get('/cipher', (req, res) => {
    const text= req.query.text;
    const shift=req.query.shift;
//validation : both values are required, shift must be a number
    if(!text){
        res.status(400).send('please give the text');
    }
    if(!shift){
        res.status(400).send('please give the shift');
    }

    const numShift = parseFloat(shift);
    if(Number.isNaN(numShift)){
        return res.status(400).send('shift must be a number');
    }
    //all valid, perform the task
    //make the text uppercase for convenience
    //the question did not say what to do with punctuation marks
    //and numbers so we will ignore them and only convert letters.
    //also just the 26 letters of the alphabet in typical use in the us
    //and uk today. to support an international audience we will have to
    //do more
    //create a loop over the characters, for each letter, convert
    //using the shift

    const base = 'A'.charCodeAt(0);

    const cipher =  text
                    .toUpperCase()
                    //create an array of characters
                    .split('')
                    .map(char => { 
                        //map each original char to a converted char
                        const code = char.charCodeAt(0);//get the char code

                //if it is not one of the 26 letters ignore it
                if(code < base || code > (base+26)){
                    return char;
                }
    //otherwise convert it
    //get the distance from a
    let diff = code - base; 
    diff= diff + numShift;
    diff= diff%26;

    //in case shift takes the value past z, cycle back to the beginning
    const shiftedChar = String.fromCharCode(base+diff);
    return shiftedChar;
                    })
                    //construct a string from the array
                .join('');
                //return the response
    res.status(200).send(cipher);
});

//q3

app.get('/lotto', (req, res) =>{
    const {numbers} = req.query;

    //validation:
    //1. the numbers array must exist
    //2. must be an array
    //3. must be 6 numbers
    //4. numbers must be between 1 and 20

    if(!numbers){
        return res.status(400).send('please give the  numbers!!');
    }
    if(!Array.isArray(numbers)){
        return res.status(400).send('number must be in an array');
    }

    const guess = numbers
                    .map(num => parseInt(num))
                    .filter(num => !Number.isNaN(num) && (num >=1 && num <=20));

        if(guess.length != 6){
            return res.status(400).send('number must contain 6 / between 1 and 20')
        }

    //fully validated numbers

    //here are the 20 numbers to choose from
    const stockNumbers = Array(20).fill(1).map((_,i)=> i+1);

    //randomly choose 6
    const winningNumber = [];
    for(let i = 0 ; i < 6 ; i++){
        const ran = Math.floor(Math.random()*stockNumbers.length);
        winningNumber.push(stockNumbers[ran]);
        stockNumbers.splice(ran, 1);
    }

    //compare the guess to the winning number
    let diff= winningNumber.filter(num => !guess.includes(num));
    //construct a response
    let responseText;

    switch(diff.length){
        case 0 :
            responseText = 'Wow! Unbelievable! You could have won the mega millions!';
            break;
        case 1 :
            responseText = 'Congratulations! You win $100!';
            break;
        case 2 :
            responseText = 'Congratulations, you win a free ticket!';
            break;
        default:
            responseText = 'Sorry, you lose';
    }
    //how the results ran
    res.json({
        guess,
        winningNumber,
        diff,
        responseText
    });

    res.send(responseText);
})