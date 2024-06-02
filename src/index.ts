import express, { Request, Response } from "express";
import mongoose, { mongo } from "mongoose";
import Product, { IProduct } from "./model/product";
import Survey from "./model/survey";
import connectDB from "./config/db";
import cors from 'cors'
import * as line from '@line/bot-sdk';

const app = express();
const port = process.env.PORT || 8080;

connectDB()

app.use(cors({
  origin: '*',
  methods : 'GET,HEAD,PUT,PATCH,POST,DELETE'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new line.messagingApi.MessagingApiClient({
  channelAccessToken: "eCR3NwXUmzIqOq8HMYtuXooaWPDEBlszMMeF6BGoyRk4XpK2Ho89HV+hF0IUBuhsTRZYhWxLzRPFV6GyywHaaY7EL4t6uH8KgWUDTh4crPqW560gTHNJC98g+eStkQXgxKUO5StidnjRdPDxScYUHAdB04t89/1O/w1cDnyilFU=",

});

app.get("/", (_req: Request, res: Response) => {
  res.status(201).json({ message: "Welcome to Auth ts" });
});

app.get("/ping", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome Ping" });
});

app.get("/products", async (_req: Request, res: Response) => {
  const data = await Product.find({})
  res.status(200).json(data);
});

app.get("/products/:id", async (req:Request , res:Response ) => {
   try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/products", (req:Request, res:Response) => {
  Product.create(req.body)
    .then((products) => {
      res.json(products);
    })

});

app.put("/products/:id", (req:Request, res:Response) => {
  Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then( (products) => {
      res.json(products);
    })

});

app.delete("/products/:id", (req:Request, res:Response ) => {
  Product.findByIdAndDelete(req.params.id,req.body)
    .then(  (products) => {
      res.json(products);
    })

});

// Surveys
app.get("/surveys", (req:Request, res:Response) => {
  Survey.find()
    .then((surveys) => {
      res.json(surveys); 
    })
});


app.get("/surveys/:id", (req:Request , res:Response) => {
  Survey.findById(req.params.id)
    .then((surveys) => {
      res.json(surveys);
    })
   
});

app.post("/surveys", (req:Request, res:Response) => {
  Survey.create(req.body)
    .then((surveys) => {
      res.json(surveys);
    })
   
});

app.put("/surveys/:id", (req:Request, res:Response) => {
  Survey.findByIdAndUpdate(req.params.id,req.body)
    .then( (surveys) => {
      res.json(surveys);
    })
   
});

app.delete("/surveys/:id", (req:Request, res:Response) => {
  Survey.findByIdAndDelete(req.params.id,req.body)
    .then(  (surveys) => {
      res.json(surveys);
    })
   
});

app.post("/webhook", (req: Request, res: Response) => {
  const event = req.body.events[0] ?? undefined;
    if(!event)
    return res.sendStatus(200).end()
    console.log("event=>",event)

    if (event.type === 'message') {
      const message = event.message;
    
      if (message.type === 'text' ) {

       if(message.text === 'รายละเอียด'){
          client.replyMessage({
          replyToken: event.replyToken,
          messages: [{
            type: 'text',
            text: 'แชทนี้จะเกี่ยวกับเกม สามารถ ดูข้อมูล ราคา และจะพัฒนาต่อไปเรื่อยๆ',
             }]
          });
        }
        else if(message.text === 'สินค้า'){
          client.replyMessage({
          replyToken: event.replyToken,
          messages: [{
            type: 'text',
            text: 'ยินดีต้อนรับสู่ GameProduct กดลิ้งได้เลยน้าาา \n=> https://liff.line.me/2005244347-lY246dm4 ',
             }]
          });
        }
       else if(message.text === 'โปรโมชั่น'){
          client.replyMessage({
          replyToken: event.replyToken,
          messages: [{
            type: 'text',
            text: 'ไม่มีโปรงับ เสียใจด้วย--',
             }]
          });
        }
       else if(message.text === 'ข้อมูลของฉัน'){
          client.getProfile(event.source.userId).then(proflie =>{
            client.replyMessage({
              replyToken: event.replyToken,
              messages: [{
                type: 'text',
                text: `ชื่อของคุณ = ${proflie.displayName}\nสเตตัสของคุณ = ${proflie.statusMessage}`,
              }]
            })
          })
        }   
        else if(message.text === 'รอดำเนินการ...'){
          client.getProfile(event.source.userId).then(proflie =>{
            client.replyMessage({
              replyToken: event.replyToken,
              messages: [{
                type: 'text',
                text: `เราขอขอบคุณ คุณ${proflie.displayName}ที่สั่งซื้อสินค้าจากทางเรา...`
              }]
            })
          })
        }else  {
          client.replyMessage(
            {
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
            }
          )
        }   
      }
    }
    
  })

app.post("/sent-gameproduct/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  // const _id = req.query._id as string ;
  // console.log("id=> "+_id)
  // console.log(req.body)
  console.log(req.body)
  console.log("userId=> "+userId)
  let {prod_id, prod_img, prod_name, prod_desc, prod_beforeprice, prod_price, url, steamurl } = req.body ;


  if(  (prod_price === 0 || prod_price === null) || (prod_beforeprice === 0 || prod_beforeprice === null)     ){
    prod_beforeprice = '-' 
    prod_price ='ฟรี';
  }else if (prod_beforeprice === prod_price){
    prod_beforeprice = '-' 
    prod_price = "ราคา " +(prod_price/100).toFixed(0)+ ' บาท' ;
  }
  else{
    prod_price = "ลดเหลือ " +(prod_price/100).toFixed(0)+ ' บาท' ;
    prod_beforeprice = 'จาก '+ (prod_beforeprice/100).toFixed(0)+ ' บาท' ;
  }
 
   client.pushMessage({
      to: userId,
      messages:[
        {
          "type": "flex",
          "altText": "รหัสสินค้า "+prod_id,
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
                  "text":  prod_name,
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
                              "text":  prod_beforeprice,
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
                          "text":  prod_price,
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
        } 
        ,
        {
          type:"text",
          text: `${steamurl}${prod_id}`
        }
      ]
    })

  })

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
