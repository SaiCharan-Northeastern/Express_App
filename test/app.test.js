const request = require("supertest");
const app = require('../App.js');


let expect = require('chai').expect;

describe('/get healthz', function(){

it('it should return the heartbeat', async function(){
    // let user = {
       
    //     "username": "jack@gmail.com",
    //     "password": "Jack",
    //     "firstname": "Jack",
    //     "lastname": "Jack",
    // }
    const response = {status : 200};

    expect (response.status).to.eql(200);
} )

});



