const validator = require("../validations/validator");
const cartModel = require("../models/cartModel");
const orderModel = require("../models/orderModel");

const createOrder = async function (req, res) {
    try {
        let userId = req.params.userId;
        let data = req.body;
        let { cartId, status, cancellable } = data;

        if (!validator.isValid(userId)) {
            return res.status(400).send({ status: false, message: "User ID is missing" });
        }
 // if body is empty 
 // cartid validation 
  // checking if the cart exist from the userid   
  // if cart exist but cart is empty


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

