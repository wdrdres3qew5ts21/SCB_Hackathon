const connection = require('../connection/connection');

function checkIsLoginPass(username,password){
    return connection.pool.query(`SELECT count(*) as "count" FROM scbhackathon.Authentication t where t.Username = '${username}' and  t.Password = '${password}'`)
    .then(result => {
        console.log(result[0]);
        
        if(result[0].count == 1){
            console.log(true);
            
            return true;
        }
        else {
            console.log(false);
            
            return false;
        }
    })
}

function  login(jsonLogin) {
    let loginData = jsonLogin;
    connection.pool.query(`SELECT count(*) as "count" FROM scbhackathon.Authentication t where t.Username = '${loginData.Username}' and  t.Password = '${loginData.Password}'`)
    .then(result => {
        if(result[0].count == 1){
            console.log("TKWERWEFFW");
            return "TKWERWEFFW";
        }
        else{
            console.log("Not Pass");
            return null;
        }
    })
    .catch(err => {
        console.log(err);
    })
}

 module.exports = {
     checkIsLoginPass
 }
