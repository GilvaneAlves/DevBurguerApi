import { mongo } from "mongoose";





const OrderSchema = mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    products: [{
        id: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    }],
    status: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

export default mongoose.model('Order', OrderSchema);