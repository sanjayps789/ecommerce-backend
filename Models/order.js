const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
            },
            quantity: {
                type: Number,
            },
            price: {
                type: Number,
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    deliveryAddress: [
        {
            fullName: {
                type: String,
                required: true
            },
            mobile: {
                type: String,
                required: true
            },
            pincode: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            landmark: {
                type: String
            },
            alternateMobile: {
                type: String
            },
            addressType: {
                type: String,
                required: true
            }
        }
    ],
    paymentMethod: {
        type: String,
        default: 'COD'
    },
    paymentStatus: {
        type: String,
        default: 'Pending'
    },
    orderStatus: {
        type: String,
        default: 'Processing'
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

const orders = mongoose.model('orders', orderSchema);

module.exports = orders;
