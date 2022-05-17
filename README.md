# 🛡️🙌 Nano Proof of Ownership Protocol V0.2

```
// pseudo code example

// 1. sign (in browser/app)

let domain = 'nano.org'; // domain, ex. from process.env
let algorithm = 'ed25519-blake2'; // algorithm
let serverTime = +new Date(); // timestamp, ex. from GET/use UTC
let publicKeyHex = 'be';
let privateKeyHex = 'ef';
let token = sign(serverTime,domain, publicKeyHex, privateKeyHex);
console.log("token", token);

// 2. verify (on your server)

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
```

## Context: 🛡️🙌 Nano Proof of Ownership Protocol V0.2
The purpose: to provide wallet builders with a simple flexible solution (or starting point) for Proof of Ownership using Nano wallets.

### About the variabes:
Time is the number that we almost all "agree" on, and can be used for expiration.

Domains have a specific owner that we all "agree" on, and can be used for an unique id.

Signing provides proof of accounts.

And the signing method or algorithm can also be of choice, because you could even use the Nano wallet's seed to seed other cryptographic systems.

Perhaps the only thing you need to send from the client is the following:

- Timestamp (for security to make sure user has access to the Nano wallet and not just the signature, UTC/Server based)

- Domain (as part of the unique challenge and means to verify the message, without www)

- Signature (actual signed  timestamp+domain to validate everything)

- Public key (to verify the private key ownership)

- Algorithm (to know how to extract the signature, ex. which libraries was used to sign)

You could then send one string TIMESTAMP.ALGO.PUBLICKEY.SIGNATURE (seperated by dots, buffers HEX encoded) to extract and instantly validate a Nano wallets ownership on any webserver with multiple choices for signing/verification algorithms.

First algorithm can for example be "ed25519-blake2" by https://github.com/numsu/nanocurrency-web-js/blob/master/lib/ed25519.ts (currently available as npm library for  frontend, not yet useable in backend)


### Run Demo Pseudo Code
```
git clone https://github.com/neil-yoga/nano-proof-of-ownership-protocol
node index.js
# Should output:
# token 1652821527006.ed25519-blake2.be.signed_msg_1652821527006.nano.org 
# valid true 
```
