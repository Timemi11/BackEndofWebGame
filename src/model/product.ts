import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    pictureUrl: string;
    userId: string;
    displayName: string;
    statusMessage: string;
    prod_img:string
    prod_name: string;
    prod_desc: string;
    prod_price: number;
    updated_at?: Date;
  }

const productSchema:Schema  = new mongoose.Schema({
    pictureUrl:String,
    userId: String,
    displayName: String,
    statusMessage: String,
    prod_img:String,
    prod_name:String,
    prod_desc:String,
    prod_price:Number,
    update_at: { type: Date, default: Date.now },
});


export default mongoose.model<IProduct>("Product", productSchema);
