//Authenticate Router
//Username and Password Login

//imports
var jwt        = require('jsonwebtoken'),
Subscription   = require('../models/subscription.schema.js'),
errors         = require('../errors/errors.json'),
grpc           = require("grpc");

var paymentDescriptor = grpc.load(__dirname + "/../proto/payment.proto").payment;
var paymentClient = new paymentDescriptor.PaymentService('service.payment:1295', grpc.credentials.createInsecure());
// var authenticationDescriptor = grpc.load(__dirname + '/../proto/authentication.proto').authentication;
// var authenticationClient = new authenticationDescriptor.AuthenticationService('service.authentication:1295', grpc.credentials.createInsecure());


var subscription = {};


subscription.create = function(call, callback){
  jwt.verify(call.metadata.get('authorization')[0], process.env.JWT_SECRET, function(err, token){
    if(err){
      return callback({message:err},null);
    }
    call.request.owner = token.sub;

    //validation handled by database
    var newSubscription = new Subscription(call.request);
    newSubscription.save(function(err, result){
      if(err){
        return callback({message:JSON.stringify({code:'04000001', error:errors['0001']})},null);
      }

      //charge the user for the rest of the month
      var today = new Date();
      var daysInMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
      var daysLeftInMonth = daysInMonth - today.getDate() + 1;
      var feeLeftForMonth = (call.request.fee/daysInMonth) * daysLeftInMonth;

    });
  });
}



module.exports = subscription;
