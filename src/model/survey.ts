import mongoose, { Schema, Document } from "mongoose";

export interface Answer {
    value: string;
  }

export interface ISurvey extends Document {
    userId: string;
    pictureUrl: string;
    displayName: string;
    statusMessage: string;
    answers: Answer[];
    updated_at: Date;
  }

const SurveySchema:Schema  = new mongoose.Schema({
    pictureUrl:String,
    userId: String,
    displayName: String,
    statusMessage: String,
    answers: [ { value : { type: [String], default: [] } } ], 
    update_at: { type: Date, default: Date.now },
});


export default mongoose.model<ISurvey>("Survey", SurveySchema);