## Assignment

Add a microservice called data-service with no HTTP endpoint but just a MQ receiver.

Send payload received in POST requests of billing-service, shipping-service and users-service to data-service via MQ and further send all messages received by data-service to webhook-service using MQ.

## command for running rabbitMQ container
docker run --name rabitmqusama -d -p 5672:5672 
-p 15672:15672 -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin rabbitmq:management
