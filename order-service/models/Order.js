const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const OrderSchema = new Schema({
        products: [
            { product_id: String },
        ],
        total: {
            type: Number,
            required: true,
        },},
    { timestamp: true }
);


module.exports = mongoose.model("Order", OrderSchema);
