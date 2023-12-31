const express = require("express");
const app = express();
const PORT = process.env.PORT || 3002;
const mongoose = require("mongoose");
const amqp = require("amqplib");
const Order = require("./models/Order");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var channel, connection; 

require('dotenv').config({path: '.env'})

//Connect to DB
mongoose
    .connect(process.env.DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Order-Service connected to MongoDB"))
    .catch((e) => console.log(e));



//connect rabbitMQ
async function connectToRabbitMQ(){
    const amqpServer = "amqp://guest:guest@localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("order-service-queue");
}

//create an Order 
createOrder = (products) => {
    let total = 0;
    products.forEach((product) => {
        total += product.price;
    });


    const order = new Order({
        products, 
        total, 
    }); 
    order.save();
    return order; 
}


//grab order queue
connectToRabbitMQ().then(() => {
    channel.consume("order-service-queue", (data) => {
        // send new order to RabbitMQ (same queue as product service)
        const { products } = JSON.parse(data.content);
        const newOrder = createOrder(products);
        channel.ack(data);
        channel.sendToQueue(
            "product-service-queue",
            Buffer.from(JSON.stringify(newOrder))
        );
    });
});

//listen for requests
app.listen(PORT, () => {
    console.log(`Order-Service listening on port ${PORT}`);
});


