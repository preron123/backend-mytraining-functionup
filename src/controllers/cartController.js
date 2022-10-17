const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const { isValidObjectId, isValidNum } = require('../utils/validation')


const createCart = async (req, res) => {
    try {
        let { cartId, productId, quantity } = req.body;
        let userId = req.params.userId;

        // validation for emptyBody
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please Enter Some Input" });
        }
        //validation for userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid userId" });
        }
        let user = await userModel.findOne({ _id: userId });
        if (!user) {
            return res.status(404).send({ status: false, message: "user not found" });
        }
        let cartCreated = await cartModel.findOne({ userId });
        if (cartId) {
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "Invalid cartId" });
            }
            if (!cartCreated) {
                return res.status(404).send({ status: false, message: "cart is not created" });
            }
            if (cartCreated._id != cartId) {
                return res.status(403).send({ status: false, message: "you can`t add product on other's cart" });
            }
        }

        if (!productId) {
            return res.status(400).send({ status: false, message: "productId is mandatory" })
        };
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Invalid productId" });
        }
        let product = await productModel.findOne({ _id: productId, isDeleted: false });
        if (!product) {
            return res.status(404).send({ status: false, message: "product not found" });
        }

        if (!quantity) {
            return res.status(400).send({ status: false, message: "quantity is mandatory" })
        };
        if (!isValidNum(quantity)) {
            return res.status(400).send({ status: false, message: "quantity must be in decimal Number" })
        };
        if (cartCreated) {
            let cart = [...cartCreated.items];
            if (cart.length == 0) {
                cart.push({ productId, quantity });
            } else {
                for (let i = 0; i < cart.length; i++) {
                    if (cart[i].productId == productId) {
                        cart[i].quantity += quantity;
                        break;
                    }
                }
            }

            let newPrice = cartCreated.totalPrice + product.price * quantity;
            let result = await cartModel.findByIdAndUpdate(cartCreated._id, { items: cart, totalPrice: newPrice, totalItems: cart.length, }, { new: true });
            return res.status(200).send({ status: true, message: "Sucess", data: result });
        } else {
            let items = [{ productId, quantity }];
            let totalPrice = product.price * quantity;
            let result = await cartModel.create({ userId, items, totalPrice, totalItems: quantity });
            return res.status(201).send({ status: true, message: "Success", data: result });
        }
    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.params.userId

        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Invalid userId" })
        }
        let findCart = await cartModel.findOne({userId })
        if (!findCart) {
            return res.status(404).send({ status: false, message: "Cart not found" })
        }
        return res.status(200).send({ status: true, message: "cart details", data: findCart })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const deleteCartById = async function (req, res) {
    try {
        const userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "Invalid userId" })
        }
        const userDetails = await userModel.findOne({ _id: userId })
        if (!userDetails) {
            return res.status(404).send({ status: false, msg: "user not found" })
        }

        const deleteCartDetails = await cartModel.findOneAndUpdate({userId}, { $set: { items: [], totalPrice: 0, totalItems: 0 } }, { new: true })
        if (!deleteCartDetails) {
            return res.status(404).send({ status: false, msg: "cart not found" })
        }

        return res.status(204).send({ status: true, massege: "Deleted Successfully", data: deleteCartDetails })

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

module.exports = { createCart, getCart ,deleteCartById}