// pseudo code example

// signing (in browser/app)
let domain = 'nano.org'; // domain, ex. from process.env
let algorithm = 'ed25519-blake2'; // algorithm
let serverTime = +new Date(); // timestamp, ex. from GET/use UTC
let publicKeyHex = 'be';
let privateKeyHex = 'ef';
let token = sign(serverTime,domain, publicKeyHex, privateKeyHex);
console.log("token", token);

let valid = verify(domain, token);
console.log("valid", valid);

/*
Should output:
token 1652821527006.ed25519-blake2.be.signed_msg_1652821527006.nano.org 
valid true 
*/


function sign(timestamp,domain, publicKeyHex, privateKeyHex) {
    // todo: actual signing
    let signatureHex = 'signed_msg_'+timestamp + '.' + domain;
    return generateToken(timestamp, algorithm, publicKeyHex, signatureHex);
}

function generateToken(timestamp,algo,publicKeyHex, signatureHex) {
    return timestamp + '.' + algo + '.' + publicKeyHex + '.' + signatureHex;
}


function verify(domain,token) {
    let pieces = token.split('.'); //[0]=timestamp, [1]=algo, [2]=publicKeyHex, [3]=signatureHex
    let maxDistanceInSeconds = 90; // tokens are valid for 1.5 minute
    let serverTimeNow = +new Date();
    let validToken = verifyTimestamp(pieces[0],serverTimeNow, maxDistanceInSeconds);
    if(!validToken) return false;
    // todo: actual verification
    return true; 
}


// super simple timestamp expiration verifier
function verifyTimestamp(timestamp, timestamp2, maxDistanceInSeconds) {
    let distance = (timestamp/1000)-(timestamp2/1000); // division by 1000 to convert epoch to seconds
    if(distance < 0) {
        distance = distance * -1; // make it positive 
    }
  
    return distance < maxDistanceInSeconds;
}
