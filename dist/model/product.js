"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    pictureUrl: String,
    userId: String,
    displayName: String,
    statusMessage: String,
    prod_img: String,
    prod_name: String,
    prod_desc: String,
    prod_price: Number,
    update_at: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model("Product", productSchema);
