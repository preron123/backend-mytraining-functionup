const { isValidObjectId, isValidStatus, isValidBody, isValid } = require('../utils/validation')
const cartModel = require("../models/cartModel");
const userModel = require('../models/userModel');
const orderModel = require("../models/orderModel");

const createOrder = async function (req, res) {
    try {
        let userId = req.params.userId;
        let data = req.body;
        let { cancellable, status } = data;
        data.userId = userId

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Invalid userId" })
        }

        const userDetails = await userModel.findOne({ _id: userId })
        if (!userDetails) {
            return res.status(404).send({ status: false, msg: "user not found" })
        }
        // //Authorization
        if (req.userId !== userId) {
            return res.status(403).send({ status: false, message: "Access denied" });
        }
        let dataFromCart = await cartModel.findOne({ userId })
        if (!dataFromCart) {
            return res.status(404).send({ status: false, message: "Cart not found" })
        }
        //add data from cart
        data.items = dataFromCart.items//add items in data
        if (dataFromCart.items.length == 0) {
            return res.status(404).send({ status: false, message: "Items not found" })
        }
        data.totalPrice = dataFromCart.totalPrice
        data.totalItems = dataFromCart.totalItems
        let quantityTotal = 0
        for (let i = 0; i < dataFromCart.items.length; i++) {
            quantityTotal += dataFromCart.items[i].quantity
        }
        data.totalQuantity = quantityTotal

        //validation for cancellable and status
        if (cancellable) {
            if (typeof cancellable !== "boolean") {
                return res.status(400).send({ status: false, message: "cancellable Boolean only" })
            };
        }
        if (status) {
            if (status != "pending") {
                return res.status(400).send({ status: false, message: "Status should be pending" })
            }
        }
        await cartModel.findOneAndUpdate({ userId }, { $set: { items: [], totalPrice: 0, totalItems: 0 } })
        let result = await orderModel.create(data);
        return res.status(201).send({ status: true, message: "Success", data: result });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const updateOrder = async function (req, res) {
    try {
        userId = req.params.userId
        body = req.body

        if (!isValidObjectId(userId))
            return res.status(400).send({ status: false, msg: `Invalid userId` });

        const user = await userModel.findOne({ _id: userId })
        if (!user) return res.status(404).send({ status: false, msg: "User not found" })

        // //Authorization
        if (req.userId !== userId) {
            return res.status(403).send({ status: false, message: "Access denied" });
        }
        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "body should not be empty" })
        }
        let { orderId, status } = body
        if (!isValid(orderId))
            return res.status(400).send({ status: false, msg: "orderId is required" })
        if (!isValidObjectId(orderId))
            return res.status(400).send({ status: false, msg: `orderId ${orderId} is invalid` });

        const validOrder = await orderModel.findOne({ _id: orderId })

        if (!validOrder) return res.status(404).send({ status: false, message: "Order does not exists" })

        if (!isValid(status))
            return res.status(400).send({ status: false, msg: "status is required" })

        if (!isValidStatus(status))
            return res.status(400).send({ status: false, message: `Order status should be 'pending', 'completed', 'cancelled' ` })

        if (validOrder.status == 'completed' && status == 'pending')
            return res.status(400).send({ status: false, message: "This order is already completed" })

        if (status == 'cancelled') {
            if (validOrder.cancellable == false)
                return res.status(400).send({ status: false, message: "This order is not cancellable." })
        }
        let data = {}
        data.status = status

        let updateData = await orderModel.findOneAndUpdate({ _id: orderId }, data, { new: true })
        return res.status(200).send({ status: true, message: "Success", data: updateData })
    } catch (error) {
        res.status(500).send({ msg: "Error", error: error.message });
    }
};



module.exports = { createOrder, updateOrder }