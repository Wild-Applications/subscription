//Account service

//Imports
const grpc = require('grpc');
const subscriptionHelper = require('./helpers/subscription.helper.js');
const proto = grpc.load(__dirname + '/proto/subscription.proto');
const server = new grpc.Server();
const mongoose = require('mongoose');
const dbUrl = "mongodb://wildappsadminmwpayments:5RfmnapT4W5rKYMi@paymentscluster-shard-00-00-ptlcz.mongodb.net:27017,paymentscluster-shard-00-01-ptlcz.mongodb.net:27017,paymentscluster-shard-00-02-ptlcz.mongodb.net:27017/SUBSCRIPTIONS?ssl=true&replicaSet=PaymentsCluster-shard-0&authSource=admin";

mongoose.connect(dbUrl);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open');
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
  process.exit(0);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
  process.exit(0);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


//define the callable methods that correspond to the methods defined in the protofile
server.addService(proto.subscription.Service.service, {
  get: function(call, callback){
    paymentHelper.get(call, callback);
  }
});

//Specify the IP and and port to start the grpc Server, no SSL in test environment
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());

//Start the server
server.start();
console.log('gRPC server running on port: 50051');
