"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("./model/product"));
const survey_1 = __importDefault(require("./model/survey"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const line = __importStar(require("@line/bot-sdk"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
(0, db_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: "eCR3NwXUmzIqOq8HMYtuXooaWPDEBlszMMeF6BGoyRk4XpK2Ho89HV+hF0IUBuhsTRZYhWxLzRPFV6GyywHaaY7EL4t6uH8KgWUDTh4crPqW560gTHNJC98g+eStkQXgxKUO5StidnjRdPDxScYUHAdB04t89/1O/w1cDnyilFU=",
});
app.get("/", (_req, res) => {
    res.status(201).json({ message: "Welcome to Auth ts" });
});
app.get("/ping", (_req, res) => {
    res.status(200).json({ message: "Welcome Ping" });
});
app.get("/products", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield product_1.default.find({});
    res.status(200).json(data);
}));
app.get("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield product_1.default.findById(req.params.id);
        if (product) {
            res.json(product);
        }
        else {
            res.status(404).json({ error: "Product not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}));
app.post("/products", (req, res) => {
    product_1.default.create(req.body)
        .then((products) => {
        res.json(products);
    });
});
app.put("/products/:id", (req, res) => {
    product_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((products) => {
        res.json(products);
    });
});
app.delete("/products/:id", (req, res) => {
    product_1.default.findByIdAndDelete(req.params.id, req.body)
        .then((products) => {
        res.json(products);
    });
});
// Surveys
app.get("/surveys", (req, res) => {
    survey_1.default.find()
        .then((surveys) => {
        res.json(surveys);
    });
});
app.get("/surveys/:id", (req, res) => {
    survey_1.default.findById(req.params.id)
        .then((surveys) => {
        res.json(surveys);
    });
});
app.post("/surveys", (req, res) => {
    survey_1.default.create(req.body)
        .then((surveys) => {
        res.json(surveys);
    });
});
app.put("/surveys/:id", (req, res) => {
    survey_1.default.findByIdAndUpdate(req.params.id, req.body)
        .then((surveys) => {
        res.json(surveys);
    });
});
app.delete("/surveys/:id", (req, res) => {
    survey_1.default.findByIdAndDelete(req.params.id, req.body)
        .then((surveys) => {
        res.json(surveys);
    });
});
app.post("/webhook", (req, res) => {
    var _a;
    const event = (_a = req.body.events[0]) !== null && _a !== void 0 ? _a : undefined;
    if (!event)
        return res.sendStatus(200).end();
    console.log("event=>", event);
    if (event.type === 'message') {
        const message = event.message;
        if (message.type === 'text') {
            if (message.text === 'รายละเอียด') {
                client.replyMessage({
                    replyToken: event.replyToken,
                    messages: [{
                            type: 'text',
                            text: 'แชทนี้จะเกี่ยวกับเกม สามารถ ดูข้อมูล ราคา และจะพัฒนาต่อไปเรื่อยๆ',
                        }]
                });
            }
            else if (message.text === 'สินค้า') {
                client.replyMessage({
                    replyToken: event.replyToken,
                    messages: [{
                            type: 'text',
                            text: 'ยินดีต้อนรับสู่ GameProduct กดลิ้งได้เลยน้าาา \n=> https://liff.line.me/2005244347-lY246dm4 ',
                        }]
                });
            }
            else if (message.text === 'โปรโมชั่น') {
                client.replyMessage({
                    replyToken: event.replyToken,
                    messages: [{
                            type: 'text',
                            text: 'ไม่มีโปรงับ เสียใจด้วย--',
                        }]
                });
            }
            else if (message.text === 'ข้อมูลของฉัน') {
                client.getProfile(event.source.userId).then(proflie => {
                    client.replyMessage({
                        replyToken: event.replyToken,
                        messages: [{
                                type: 'text',
                                text: `ชื่อของคุณ = ${proflie.displayName}\nสเตตัสของคุณ = ${proflie.statusMessage}`,
                            }]
                    });
                });
            }
            else if (message.text === 'รอดำเนินการ...') {
                client.getProfile(event.source.userId).then(proflie => {
                    client.replyMessage({
                        replyToken: event.replyToken,
                        messages: [{
                                type: 'text',
                                text: `เราขอขอบคุณ คุณ${proflie.displayName}ที่สั่งซื้อสินค้าจากทางเรา...`
                            }]
                    });
                });
            }
            else {
                client.replyMessage({
                    replyToken: event.replyToken,
                    messages: [
                        {
                            type: 'text',
                            text: 'ยินดีต้อนรับสู่ GameProduct ลองพิมพ์หรือกดที่ quickreply ได้เลย...',
                            quickReply: {
                                items: [
                                    {
                                        type: 'action',
                                        action: {
                                            type: 'message',
                                            label: 'รายละเอียด',
                                            text: 'รายละเอียด'
                                        }
                                    },
                                    {
                                        type: 'action',
                                        action: {
                                            type: 'message',
                                            label: 'ข้อมูลของฉัน',
                                            text: 'ข้อมูลของฉัน'
                                        }
                                    },
                                    {
                                        type: 'action',
                                        action: {
                                            type: 'message',
                                            label: 'สินค้า',
                                            text: 'สินค้า'
                                        }
                                    },
                                    {
                                        type: 'action',
                                        action: {
                                            type: 'message',
                                            label: 'โปรโมชั่น',
                                            text: 'โปรโมชั่น'
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                });
            }
        }
    }
});
app.post("/sent-gameproduct/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    // const _id = req.query._id as string ;
    // console.log("id=> "+_id)
    // console.log(req.body)
    console.log(req.body);
    console.log("userId=> " + userId);
    let { prod_id, prod_img, prod_name, prod_desc, prod_beforeprice, prod_price, url, steamurl } = req.body;
    if ((prod_price === 0 || prod_price === null) || (prod_beforeprice === 0 || prod_beforeprice === null)) {
        prod_beforeprice = '-';
        prod_price = 'ฟรี';
    }
    else if (prod_beforeprice === prod_price) {
        prod_beforeprice = '-';
        prod_price = "ราคา " + (prod_price / 100).toFixed(0) + ' บาท';
    }
    else {
        prod_price = "ลดเหลือ " + (prod_price / 100).toFixed(0) + ' บาท';
        prod_beforeprice = 'จาก ' + (prod_beforeprice / 100).toFixed(0) + ' บาท';
    }
    client.pushMessage({
        to: userId,
        messages: [
            {
                "type": "flex",
                "altText": "รหัสสินค้า " + prod_id,
                "contents": {
                    "type": "bubble",
                    "hero": {
                        "type": "image",
                        "url": prod_img,
                        "size": "full",
                        "aspectRatio": "20:13",
                        "aspectMode": "cover",
                        "action": {
                            "type": "uri",
                            "uri": url
                        }
                    },
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "text": prod_name,
                                "weight": "bold",
                                "size": "xxl"
                            },
                            {
                                "type": "box",
                                "layout": "vertical",
                                "margin": "lg",
                                "spacing": "md",
                                "contents": [
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "spacing": "none",
                                        "contents": [
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [
                                                    {
                                                        "type": "text",
                                                        "text": "รายละเอียด",
                                                        "weight": "bold",
                                                        "size": "xl"
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [
                                                    {
                                                        "type": "text",
                                                        "text": prod_desc,
                                                        "size": "md",
                                                        "margin": "none",
                                                        "style": "italic",
                                                        "action": {
                                                            "type": "uri",
                                                            "uri": url,
                                                            "label": "Our Website"
                                                        },
                                                        "color": "#9290C3"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    "footer": {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "text",
                                                "text": "ราคา",
                                                "size": "md",
                                                "color": "#000000",
                                                "weight": "bold"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "box",
                                        "layout": "vertical",
                                        "contents": [
                                            {
                                                "type": "box",
                                                "layout": "vertical",
                                                "contents": [
                                                    {
                                                        "type": "text",
                                                        "text": prod_beforeprice,
                                                        "style": "italic",
                                                        "size": "sm",
                                                        "decoration": "line-through",
                                                        "align": "center",
                                                        "color": "#B31312"
                                                    }
                                                ]
                                            },
                                            {
                                                "type": "text",
                                                "text": prod_price,
                                                "color": "#22c55e",
                                                "size": "md",
                                                "style": "normal",
                                                "weight": "bold",
                                                "align": "center"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "button",
                                        "action": {
                                            "type": "uri",
                                            "label": "ยืนยัน",
                                            "uri": `${steamurl}${prod_id}`
                                        },
                                        "color": "#ffffff"
                                    }
                                ],
                                "backgroundColor": "#6842FF",
                                "justifyContent": "center",
                                "alignItems": "center",
                                "cornerRadius": "xxl",
                                "borderColor": "#000000",
                                "borderWidth": "none"
                            }
                        ]
                    }
                }
            },
            {
                type: "text",
                text: `${steamurl}${prod_id}`
            }
        ]
    });
}));
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
