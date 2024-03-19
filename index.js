const express = require("express");
const app = express();
require("dotenv").config();
// var jwt = require("jsonwebtoken");
const cors = require("cors");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ijwgr8d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();




    const userCollection = client.db("apartmentDB").collection("users");
    const apartmentCollection = client.db("apartmentDB").collection("apartments");


    // jwt api
    // app.post("/jwt", async (req, res) => {
    //   const user = req.body;
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
    //     expiresIn: "1h",
    //   });
    //   res.cookie('token', token, {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production', 
    //     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    //   })
    // });

    // middleware
    // const verifyToken = (req, res, next) => {
    //   console.log("Inside verify token", req.headers.authorization);
    //   if (!req.headers.authorization) {
    //     return res.status(401).send({ message: "Forbidden access" });
    //   }
    //   const token = req.headers.authorization.split(" ")[1];
    //   jwt.verify(token, process.env.ACCESS_TOKEN, (error, decoded) => {
    //     if (error) {
    //       return res.status(401).send({ message: "Forbidden access" });
    //     }
    //     req.decoded = decoded;
    //     next();
    //   });
    // };


    // const verifyAdmin = async (req, res, next) => {
    //   try {
    //     if (!req.decoded || !req.decoded.email) {
    //       return res.status(401).send({ message: "Unauthorized" });
    //     }
    
    //     const email = req.decoded.email;
    //     const query = { email: email };
    //     const user = await userCollection.findOne(query);
    
    //     if (!user || user.role !== "admin") {
    //       return res.status(403).send({ message: "Forbidden access" });
    //     }
    
    //     next();
    //   } catch (error) {
    //     console.error("Error in verifyAdmin middleware:", error);
    //     return res.status(500).send({ message: "Internal server error" });
    //   }
    // };
    

    // user related
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });


    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exist", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // admin selection
    // app.get("/users/admin/:email", async (req, res) => {
    //   const email = req.params.email;
    //   if (email !== req.decoded.email) {
    //     return res.status(403).send({ message: "Forbidden access" });
    //   }
    //   const query = { email: email };
    //   const user = await userCollection.findOne(query);
    //   let admin = false;
    //   if (user) {
    //     admin = user?.role === "admin";
    //   }
    //   res.send({ admin });
    // });

    app.patch("/users/admin/:id", async (req, res) =>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
  
      // member selection
      // app.get("/users/member/:email", async (req, res) => {
      //   const email = req.params.email;
      //   if (email !== req.decoded.email) {
      //     return res.status(403).send({ message: "Forbidden access" });
      //   }
      //   const query = { email: email };
      //   const user = await userCollection.findOne(query);
      //   let agent = false;
      //   if (user) {
      //     agent = user?.role === "member";
      //   }
      //   res.send({ member });
      // });
  
      app.patch("/users/member/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            role: "member",
          },
        };
        const result = await userCollection.updateOne(filter, updatedDoc);
        res.send(result);
      });


   // all apartments
   app.get("/apartments", async (req, res) => {
    const result = await apartmentCollection.find().toArray();
    res.send(result);
  });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Project is setting");
  });
  
  app.listen(port, () => {
    console.log(`RavenClaw is setting on post ${port}`);
  });
