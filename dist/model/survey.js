"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SurveySchema = new mongoose_1.default.Schema({
    pictureUrl: String,
    userId: String,
    displayName: String,
    statusMessage: String,
    answers: [{ value: { type: [String], default: [] } }],
    update_at: { type: Date, default: Date.now },
});
exports.default = mongoose_1.default.model("Survey", SurveySchema);
