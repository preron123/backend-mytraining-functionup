const cartModel = require('../models/cartModel');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const { isValidObjectId, isValidNum ,} = require('../utils/validation')


// ----------------------------------------------------------------------------------------


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
//=============================== cart creation ==============================================
const createCart = async function (req, res) {
    try {
        let requestparams = req.params.userId
        let requestBody = req.body
        const { cartId, productId } = requestBody
        //===================== if body is empty ===========================================
        if (!validator.isValidBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Body cannot be empty" })
        }
        //============================= only valid keys can be entered in body ===================
        if (!(cartId || productId)) {
            return res.status(400).send({ status: false, message: "Please enter valid keys to create cart" })
        }
        //========================== if cartId is present =====================================
        if (cartId) {
            if (!validator.isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "invalid cartId format" })
            }
            let cartExist = await cartModel.findById(cartId)
            if (!cartExist) {
                return res.status(404).send({ status: false, message: "cart does not exist" })
            }
        }
        //============================== if product id is present ===========================
        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "invalid productId format" })
        }
        let productExist = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productExist) {
            return res.status(404).send({ status: false, message: "product does not exist" })
        }

        //================ check if cart belong to the same user ===================

        let validCart = await cartModel.findOne({ userId: requestparams })
        if (validCart) {
            if (cartId) {
                if (validCart._id.toString() != cartId) {
                    return res.status(403).send({ status: false, message: `Cart does not belong to this user` })
                }
            }
            // let filter = validCart.items.filter(x=>
            // x.productId.toString() == productId)
            // if(filter.length == 0){
            //     requestBody['quantity'] = 1
            // }
            let productInCart = validCart.items
            let proId = productExist._id.toString()
            for (let i = 0; i < productInCart.length; i++) {
                let productFromItem = productInCart[i].productId.toString()
                //==================== if product is already present in cart ==========================================
                if (proId == productFromItem) {
                    let oldCount = productInCart[i].quantity
                    let newCount = oldCount + 1
                    let uptotal = (validCart.totalPrice + (productExist.price)).toFixed(2)
                    productInCart[i].quantity = newCount
                    validCart.totalPrice = uptotal
                    await validCart.save();
                    await validCart.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })
                    return res.status(201).send({ status: true, message: 'Success', data: validCart })
                }
            }
            //================================== if new product wants to be added ====================================
            validCart.items.push({ productId: productId, quantity: 1 })
            let total = (validCart.totalPrice + (productExist.price * 1)).toFixed(2)
            validCart.totalPrice = total
            let count = validCart.totalItems
            validCart.totalItems = count + 1
            await validCart.save()
            await validCart.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })
            return res.status(201).send({ status: true, message: 'Success', data: validCart })



        }
        //==================================== if user does not have cart =====================================================
        let calprice = (productExist.price * 1).toFixed(2)
        let obj = {
            userId: requestparams,
            items: [{
                productId: productId,
                quantity: 1
            }],
            totalPrice: calprice,
        }
        obj['totalItems'] = obj.items.length
        let result = await cartModel.create(obj)
        await result.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })

        return res.status(201).send({ status: true, message: 'Success', data: result })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// ===============================================================================


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
//=================================== get cart details =======================================

// const getCart = async function (req, res) {
//     try {
//         let userId = req.params.userId  
//         if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "invalid UserId" })

//         let findCart = await cartModel.findOne({ userId: userId }).populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })
//         if (!findCart) return res.status(404).send({ status: false, message: "Cart not FOUND for this userId" })

//         return res.status(200).send({ status: true, message: "Successfull", data: findCart })

//     } 
//     catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }

// ===========================================================


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


//------------  cart update---------------

const updateCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let body = req.body
        let { cartId, productId, removeProduct } = body   
        // let { cartId, productId, removeProduct } = data       
        

        //========================================== if body is missing ==============================
        if (!isEmpty (data))
            return res.status(400).send({ status: false, message: "Body cannot be empty" });

            // if (!validator.isValidBody(data))
            // return res.status(400).send({ status: false, message: "Body cannot be empty" });


           
     

        // only 2 keys should be entered in body 
        if (!(cartId && removeProduct && productId)) {
            return res.status(400).send({ status: false, message: "enter valid keys to update cart i.e cartId,productId,removeProduct" })
        }

        // cart exist or not 
        let cartExist = await cartModel.findOne({ userId: userId })
        if (!cartExist) {
            return res.status(404).send({ status: false, message: "cart not found !!!" });
        }

        // cartId Validation
        if (cartId) {
            if (!isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "Please provide valid cart Id" });
            }
            if (cartExist._id.toString() != body.cartId) {
                return res.status(400).send({ status: false, message: `this cart belong to different user` });
            }
        }

        // if product  id is present 
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "Please enter valid product Id" });
        }
        let findProduct = await productModel.findById(body.productId)
        if (!findProduct) {
            return res.status(404).send({ status: false, message: " product found with this id" });
        }



        let productArr = cartExist.items.filter(x =>
            x.productId.toString() == data.productId) // will return an array 

        if (productArr.length == 0) {
            return res.status(404).send({ status: false, message: "product is not present in the cart" })
        }
        let indexNumber = cartExist.items.indexOf(productArr[0]) // return index no of productArr

        //============================ if removeProduct is present ===================================
        if (removeProduct) {
            if (validator.isValidNumber(removeProduct)) {
                if (!(removeProduct == 0 || removeProduct == 1)) {
                    return res.status(400).send({ status: false, message: "removeProduct can either be 0 or 1" })
                }
                if (removeProduct == 0) {
                    cartExist.totalPrice = (cartExist.totalPrice - (findProduct.price * cartExist.items[indexNumber].quantity)).toFixed(2) //to fixed is used to fix the decimal value to absolute value/or rounded value
                    cartExist.items.splice(indexNumber, 1)
                    cartExist.totalItems = cartExist.items.length
                    await cartExist.save()
                    await cartExist.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })
                }
                if (removeProduct == 1) {
                    cartExist.items[indexNumber].quantity -= 1;
                    cartExist.totalPrice = (cartExist.totalPrice - findProduct.price).toFixed(2)
                    if (cartExist.items[indexNumber].quantity == 0) {
                        cartExist.items.splice(indexNumber, 1)
                    }
                    cartExist.totalItems = cartExist.items.length
                    await cartExist.save()
                    await cartExist.populate({ path: "items.productId", select: { price: 1, title: 1, productImage: 1, _id: 0 } })
                }
            }
            else {
                return res.status(400).send({ status: false, message: "removeProduct should be number only" })
            }
        }
        return res.status(200).send({ status: true, message: "Successfully updated", data: cartExist })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { createCart, getCart ,deleteCartById,updateCart}
