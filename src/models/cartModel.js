const { default: mongoose } = require("mongoose");
const cartSchema=new mongoose.Schema({
  products:[
    {
      product:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "Product"
      },
      quantity:{
                type:Number,
                default:1,
              },
      price:Number,
      title:String,
    }
  ],
  cartTotal:{
            type:Number,
            default:0
            },
  orderStatus:{
    type:String,
    default:"Not Processed",
    enum:[
        "Not Processed",
        "Processing payment",
        "Products dispatched",
        "Order cancelled",
        "Successfully delivered"
    ]
  },
  buyer:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
  }
},
{timestamps:true})

module.exports=mongoose.model("Cart",cartSchema)