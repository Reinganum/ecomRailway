const { default: mongoose } = require("mongoose");
const orderSchema=new mongoose.Schema({
    products:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity:Number,
        }
    ],
    paymentIntent:{},
    orderStatus:{
        type:String,
        default:"Not Processed",
        enum:[
            "Not Processed",
            "Processing payment",
            "Dispatched",
            "Canceled",
            "Delivered"
        ],
    },
    // ---- PODRIA REFERENCIAR A USER O UN CART QUE IRA ASOCIADO A USER---
    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},
{timestamps:true})

module.exports=mongoose.model("Order",orderSchema)