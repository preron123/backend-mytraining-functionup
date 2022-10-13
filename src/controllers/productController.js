const productModel = require('../models/productModel');
const aws = require("../utils/aws")
const { isEmpty, isValidPrice, isValidSize } = require('../utils/validation')

const createProduct = async function (req, res) {
    try {
        let { title, description, price, currencyId, currencyFormat, productImage, style, isFreeShipping, availableSizes, installments, isDeleted } = req.body;

        //validation for emptyBody
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please Enter Some Input" });
        };
        if (!title) {
            return res.status(400).send({ status: false, message: "Title Mandatory" })
        }
        if (!isEmpty(title)) {
            return res.status(400).send({ status: false, message: "Title is String only" })
        }
        let uniqueTitle = await productModel.findOne({ title })
        if (uniqueTitle) {
            return res.status(409).send({ status: false, message: "Given title is already taken" })
        }
        if (!description) {
            return res.status(400).send({ status: false, message: "description is mandatory" })
        }
        if (!isEmpty(description)) {
            return res.status(400).send({ status: false, message: "description is String only" })
        };
        if (!price) {
            return res.status(400).send({ status: false, message: "Price is mandatory" })
        };
        if (!isValidPrice(price)) {
            return res.status(400).send({ status: false, message: "Price must be in decimal Number" })
        };
        //validation for currencyId and currencyFormat
        if (currencyId) {
            if (currencyId !== "INR") {
                return res.status(400).send({ status: false, message: "CurrencyId is always INR/String only" })
            };
        } else {
            currencyId = "INR"
        }
        if (currencyFormat) {
            if (currencyFormat !== "₹") {
                return res.status(400).send({ status: false, message: "currencyFormat is always INR/String only" })
            };
        } else {
            currencyFormat = "₹"
        }
        if (isFreeShipping) {
            if (typeof isFreeShipping !== "boolean") {
                return res.status(400).send({ status: false, message: "isFreeShipping Boolean only" })
            };
        }
        //validation for productImage and creating AWS link
        let files = req.files;
        // if (file && file.length > 0) {
        //     const url = await aws.uploadFile(file[0]);
        //     productImage = url
        // } else {
        //     return res.status(400).send({ status: false, message: "ProductImage Is Mandatory" });
        // }
        if (files.length == 0) return res.status(400).send({ status: false, message: "ProductImage is required" });
        let productImgUrl = await aws.uploadFile(files[0]);
        productImage = productImgUrl;

        if (style) {
            if (!isEmpty(style)) {
                return res.status(400).send({ status: false, message: "style String only" })
            };
        }
        if (!availableSizes) {
            return res.status(400).send({ status: false, msga: "give atleast one availableSizes" })
        };
        if (!isValidSize(availableSizes)) {
            return res.status(400).send({ status: false, msg: "availableSizes must be [S || XS || M || X || L || XXL || XL]" })
        }
        if (installments) {
            if (!isValidPrice(price)) {
                return res.status(400).send({ status: false, message: "installments must be in decimal Number" })
            };
        }
        if (isDeleted) {
            if (typeof isDeleted !== "boolean" || isDeleted == true) {
                return res.status(400).send({ status: false, message: "isDeleted Boolean only/you cant delete when product is not created" })
            };
        }
        let dataCreted = await productModel.create(req.body)
        return res.status(201).send({ status: true, message: "Product created successfully", date: dataCreted });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}

const getProductById = async (req, res) => {
    try {
        let productId = req.params.productId;

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "productId in path params is not valid", });
        }
        let result = await productModel.findOne({ _id: productId, isDeleted: false, });

        if (!result) {
            return res.status(404).send({ status: false, message: "No products found with this Id" });
        }
        return res.status(200).send({ status: true, message: "Success(product details)", data: result });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        let productId = req.params.productId;

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "product Id in params isn't valid" });
        }
        let product = await productModel.findByIdAndUpdate(productId, { isDeleted: true, deletedAt: new Date(), });
        if (!product) {
            return res.status(404).send({ status: false, message: "There is no product with this id or may be deleted" });

        }
        return res.status(200).send({ status: true, message: "The product is deleted successfully", data: result });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}

const updateProduct = async function (req, res) {
    try {

        let productId = req.params.productId
        let data = req.body
        let ImageProduct = req.files
        let { title, description, price, currencyId, currencyFormat,
            isFreeShipping, style, availableSizes, installments } = data
        if (ImageProduct && ImageProduct.length > 0) {
            data.productImage = ImageProduct
        }


        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "please enter something to update" })
        }


        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "please enter valid productId" })
        }
        let checktitle = await productModel.findOne({ title: title })
        if (checktitle) {
            return res.status(400).send({ status: false, message: "title already exist " })
        }

        if (title == "") {
            return res.status(400).send({ status: false, message: "please enter title as a value" })
        }

        if (!validName(title)) {
            return res.status(400).send({ status: false, message: "please enter title in a valid format" })
        }

        if (description == "") {
            return res.status(400).send({ status: false, message: "please enter description as a value" })
        }


        if (!validName(description)) {
            return res.status(400).send({ status: false, message: "please enter description in a valid format" })
        }




        if (price == "") {
            return res.status(400).send({ status: false, message: "please enter price as a value" })
        }
        if (price) {
            if (!validPrice(price)) {
                return res.status(400).send({ status: false, message: " please enter valid price " })
            }
        }

        if (availableSizes) {

            if (availableSizes) {
                let size = availableSizes.toUpperCase().split(",") //creating an array
                availableSizes = size;
            }
            for (let i = 0; i < availableSizes.length; i++) {
                if (!isValidSize(availableSizes[i])) {
                    return res.status(400).send({ status: false, message: "Size should be one of these - 'S', 'XS', 'M', 'X', 'L', 'XXL', 'XL'" })
                }
            }

            let updateSize = await productModel.findById(productId)
            var size = updateSize.availableSizes

            for (let i = 0; i < size.length; i++) {

                for (let j = 0; j < availableSizes.length; j++) {

                    if (size[i] == availableSizes[j]) {

                        availableSizes.splice(j, 1)
                        j = j - 1
                    }
                }
            }
            for (let k = 0; k < availableSizes.length; k++) {
                size.push(availableSizes[k])
            }

        }
        if (currencyId) {
            if (currencyId != "INR") {
                return res.status(400).send({ status: false, message: "CurrencyId should only be INR " })
            }
        }
        if (currencyFormat) {
            if (currencyFormat != "₹") {
                return res.status(400).send({ status: false, message: "currencyFormat should only be ₹" })
            }
        }
        if (isFreeShipping) {
            if (!(isFreeShipping == "true" || isFreeShipping == "false")) {
                return res.status(400).send({ status: false, message: " isFreeShipping only be true or false" })
            }
        }
        if (!validName(style)) {
            return res.status(400).send({ status: false, message: " please enter style in correct format" })
        }
        if (installments) {
            if (!/^[0-9]{1,2}$/.test(installments)) {
                return res.status(400).send({ status: false, message: "please enter installments in correct format" })
            }
        }
        if (ImageProduct && ImageProduct.length > 0) {

            var productImage = await uploadFile(ImageProduct[0])
        }

        let updatedProduct = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, {
            $set: {
                title: title, description: description, price: price, currencyId: currencyId, currencyFormat: currencyFormat, isFreeShipping: isFreeShipping,
                productImage: productImage, style: style, availableSizes: size, installments: installments
            }
        }, { new: true })
        if (!updatedProduct) {
            return res.status(400).send({ status: false, message: "product not found or deleted" })
        }

        return res.status(200).send({ status: true, message: "updated", data: updatedProduct })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}






module.exports = { createProduct }
