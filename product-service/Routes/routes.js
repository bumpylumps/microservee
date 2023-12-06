const Router = require("express").Router;
const router = new Router();
const Product = require("../models/Product");
const amqp = require("amqplib");

let order, channel, connection; 

//connecting w/ rabbitMQ

async function connectToRabbitMQ() {
    const amqpServer = "amqp://guest:guest@localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("product-service-queue");
}


//call func to connect
connectToRabbitMQ();

// Create new Product

router.post("/", async (req, res) => {
    //validate project props
    const { name, price, description } = req.body;
    if(!name || !price || !description) {
        return res.status(400).json({ 
            message: "This needs a name, price, and/or description",
        });
    }

    //create new product
        const product = await new Product({ ...req.body });
        await product.save();
        return res.status(201).json({
            message: "Product successfully added!",
            product,
    });
});

// Buy product
router.post("/buy", async (req,res) => {
    const { productIds } = req.body; 
    const products = await Product.find({_id: { $in: productIds } });


    //tell RabbitMQ about order (send to queue)
    channel.sendToQueue(
        "order-service-queue",
        Buffer.from(
            JSON.stringify({
                products
            })
        )
    );

    // Consume previously placed order from RabbitMQ & acknowledge transaction
    channel.consume("product-service-queue", (data) => {
        console.log("Consumed from product-service-queue");
        order = JSON.parse(data.content);
        channel.ack(data);
    });

    //Tell the server that everything is OK
    return res.status(201).json({
        message: "Order successfully placed",
        order,
    });
});



module.exports = router; 



