const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
const productRouter = require("./Routes/routes"); 


app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use("/products", productRouter);


require('dotenv').config({path: '.env'})



//connect to DB
mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Product-Service Connected to MongoDB"))
    .catch((e) => console.log(e));

    app.listen(PORT, () => {
        console.log(`Product-Service listening on port ${PORT}`); 
    })

    