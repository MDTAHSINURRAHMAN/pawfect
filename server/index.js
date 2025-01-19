const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const Groq = require("groq-sdk");
const stripe = require("stripe");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gs0hh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Groq client
let groqClient;
try {

  groqClient = new Groq(process.env.GROQ_API_KEY);

} catch (error) {
  console.error("Error initializing Groq:", error.message);
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Get the database and collections
    const db = client.db("pawfect");
    const usersCollection = db.collection("users");
    const volunteersCollection = db.collection("volunteers");
    const adminsCollection = db.collection("admins");
    const petsCollection = db.collection("pets");
    const bookmarksCollection = db.collection("bookmarks");
    const paymentsCollection = db.collection("payments");

    // Create user
    app.post("/users", async (req, res) => {
      try {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Get user by email
    app.get("/users/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email: email };
        const result = await usersCollection.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // all pets in user dashboard
    app.get("/user/dashboard/pets", async (req, res) => {
      const result = await petsCollection
        .find({ approved: true, adoptionStatus: "Available" })
        .toArray();
      res.send(result);
    });

    // pet details in user dashboard
    app.get("/user/dashboard/pets/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petsCollection.findOne(query);
      res.send(result);
    });

    // bookmark a pet
    app.post("/user/dashboard/pets/:id/bookmark", async (req, res) => {
      try {
        const { userEmail, petId, pet } = req.body;
        const existingBookmark = await bookmarksCollection.findOne({
          userEmail,
          petId,
        });

        if (existingBookmark) {
          return res.status(400).json({ error: "Pet already bookmarked" });
        }

        const result = await bookmarksCollection.insertOne({
          userEmail,
          petId,
          pet,
          createdAt: new Date(),
        });

        res.send(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // get all bookmarks
    app.get("/user/dashboard/bookmarks", async (req, res) => {
      try {
        const userEmail = req.query.userEmail;
        const result = await bookmarksCollection
          .find({ userEmail })
          .sort({ createdAt: -1 })
          .toArray();
        res.send(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // delete bookmark
    app.delete("/user/dashboard/bookmarks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await bookmarksCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // adoption request
    app.get("/user/adoption-request", async (req, res) => {
      const email = req.params.email;
      const query = { customerEmail: email };
      const result = await paymentsCollection.find(query).toArray();
      res.send(result);
    });

    // pet id for payment
    app.get("/user/payment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petsCollection.findOne(query);
      res.send(result);
    });

    // payment intent
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: price * 100,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    });

    // confirm payment
    app.post("/confirm-payment", async (req, res) => {
      try {
        const payment = req.body;
        const result = await paymentsCollection.insertOne(payment);

        // Update pet status to adopted
        const filter = { _id: new ObjectId(payment.petId) };
        const updateDoc = {
          $set: {
            adoptionStatus: "pending",
            requestedBy: payment.customerEmail,
            requestedAt: new Date(),
          },
        };
        await petsCollection.updateOne(filter, updateDoc);

        res.send(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // get pending payments
    app.get("/user/payments/pending/:email", async (req, res) => {
      const email = req.params.email;
      const query = { customerEmail: email };
      const result = await paymentsCollection.find(query).toArray();
      res.send(result);
    });

    // Create volunteer
    app.post("/volunteers", async (req, res) => {
      try {
        const volunteerData = req.body;
        const hashedPassword = await bcrypt.hash(volunteerData.password, 10);
        const volunteer = {
          ...volunteerData,
          password: hashedPassword,
          status: "pending",
          createdAt: new Date(),
        };
        const result = await volunteersCollection.insertOne(volunteer);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Get volunteer by email
    app.get("/volunteers/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email: email };
        const result = await volunteersCollection.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Volunteer login
    app.post("/volunteer/login", async (req, res) => {
      const { email, password } = req.body;
      const volunteer = await volunteersCollection.findOne({ email });
      if (!volunteer) {
        return res.status(404).json({ error: "Volunteer not found" });
      }
      if (volunteer.status !== "approved") {
        return res.status(403).json({
          error:
            volunteer.status === "pending"
              ? "Your account is pending approval"
              : "Your account has been rejected",
          status: volunteer.status,
        });
      }
      const isPasswordCorrect = await bcrypt.compare(
        password,
        volunteer.password
      );
      if (!isPasswordCorrect) {
        return res.status(401).json({ error: "Invalid password" });
      }
      res.json({ success: true, volunteer });
    });

    // Add an admin
    app.post("/admins", async (req, res) => {
      const admin = req.body;
      const result = await adminsCollection.insertOne(admin);
      res.send(result);
    });

    // Get admin by email
    app.get("/admins/:email", async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email: email };
        const result = await adminsCollection.findOne(query);

        if (!result) {
          return res.status(404).json({ message: "Admin not found" });
        }

        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Admin login
    app.post("/admin/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        const admin = await adminsCollection.findOne({ email });
        if (!admin) {
          return res.status(404).send({ error: "Admin not found" });
        }
        if (password !== admin.password) {
          return res.status(401).send({ error: "Invalid password" });
        }
        res.send({ success: true, admin });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // all users in admin dashboard
    app.get("/admin/users", async (req, res) => {
      const result = await usersCollection.find({}).toArray();
      res.send(result);
    });

    // get user by email
    app.get("/admin/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // update user
    app.put("/admin/users/:email", async (req, res) => {
      const email = req.params.email;
      const updatedUser = req.body;
      const query = { email: email };
      const result = await usersCollection.updateOne(query, {
        $set: updatedUser,
      });
      res.send(result);
    });

    // delete user
    app.delete("/admin/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // all volunteers in admin dashboard
    app.get("/admin/volunteers", async (req, res) => {
      const result = await volunteersCollection
        .find({ status: "approved" })
        .toArray();
      res.send(result);
    });

    // all pending volunteers in admin dashboard
    app.get("/admin/volunteers/pending", async (req, res) => {
      const result = await volunteersCollection
        .find({ status: "pending" })
        .toArray();
      res.send(result);
    });

    // pending volunteers with email
    app.get("/admin/volunteers/pending/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await volunteersCollection.findOne(query);
      res.send(result);
    });

    // get volunteer by email
    app.get("/admin/volunteers/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await volunteersCollection.findOne(query);
      res.send(result);
    });

    // update volunteer
    app.put("/admin/volunteers/:email", async (req, res) => {
      const email = req.params.email;
      const updatedVolunteer = req.body;
      const query = { email: email };
      const result = await volunteersCollection.updateOne(query, {
        $set: updatedVolunteer,
      });
      res.send(result);
    });

    // delete volunteer
    app.delete("/admin/volunteers/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await volunteersCollection.deleteOne(query);
      res.send(result);
    });

    // Update volunteer status (for admin approval)
    app.patch("/admin/volunteers/:email/status", async (req, res) => {
      try {
        const { email } = req.params;
        const { status } = req.body;
        const query = { email: email };
        const updateDoc = {
          $set: {
            status: status,
            updatedAt: new Date(),
          },
        };
        const result = await volunteersCollection.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // add a pet by admin
    app.post("/admin/pets", async (req, res) => {
      const pet = req.body;
      const result = await petsCollection.insertOne(pet);
      res.send(result);
    });

    // all pets in admin dashboard
    app.get("/admin/pets", async (req, res) => {
      const result = await petsCollection
        .find({ approved: true, adoptionStatus: "Available" })
        .toArray();
      res.send(result);
    });

    // all adopted pets in admin dashboard
    app.get("/admin/pets/adopted", async (req, res) => {
      const result = await petsCollection
        .find({ adoptionStatus: "adopted" })
        .toArray();
      res.send(result);
    });

    // all pending pets in admin dashboard
    app.get("/admin/pets/pending", async (req, res) => {
      const result = await petsCollection.find({ approved: false }).toArray();
      res.send(result);
    });

    // get pet by id
    app.get("/admin/pets/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petsCollection.findOne(query);
      res.send(result);
    });

    // update pet
    app.put("/admin/pets/:id", async (req, res) => {
      const { id } = req.params;
      try {
        // Remove _id from the request body if it exists
        const { _id, ...updateData } = req.body;

        const result = await db
          .collection("pets")
          .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Pet not found" });
        }

        res.json({ message: "Pet updated successfully" });
      } catch (error) {
        res
          .status(500)
          .json({ message: "Error updating pet", error: error.message });
      }
    });

    // delete pet
    app.delete("/admin/pets/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petsCollection.deleteOne(query);
      res.send(result);
    });

    // all adoption requests in admin dashboard
    app.get("/admin/adoption-requests", async (req, res) => {
      const result = await paymentsCollection
        .find({ approvalStatus: "pending" })
        .toArray();
      res.send(result);
    });

    // update adoption request status
    app.patch("/admin/adoption-requests/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const { approvalStatus } = req.body;

        // Update the payment status
        const paymentResult = await paymentsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { approvalStatus } }
        );

        // If approved, also update the pet's adoption status
        if (approvalStatus === "approved") {
          const payment = await paymentsCollection.findOne({
            _id: new ObjectId(id),
          });
          if (payment) {
            await petsCollection.updateOne(
              { _id: new ObjectId(payment.petId) },
              { $set: { adoptionStatus: "adopted" } }
            );
          }
        }

        res.json({ success: true, message: "Status updated successfully" });
      } catch (error) {
        console.error("Error updating adoption request:", error);
        res
          .status(500)
          .json({ success: false, message: "Error updating status" });
      }
    });

    // make a adopted pet route
    app.get("/admin/pets/adopted", async (req, res) => {
      const result = await petsCollection
        .find({ adoptionStatus: "adopted" })
        .toArray();
      res.send(result);
    });

    // all approved adoption requests in admin dashboard
    app.get("/admin/adoption-requests/approved", async (req, res) => {
      const result = await paymentsCollection
        .find({ approvalStatus: "approved" })
        .toArray();
      res.send(result);
    });

    // all rejected adoption requests in admin dashboard
    app.get("/admin/adoption-requests/rejected", async (req, res) => {
      const result = await paymentsCollection
        .find({ approvalStatus: "rejected" })
        .toArray();
      res.send(result);
    });

    // all users in volunteer dashboard
    app.get("/volunteer/dashboard/users", async (req, res) => {
      const result = await usersCollection.find({}).toArray();
      res.send(result);
    });

    // all pets in volunteer dashboard
    app.get("/volunteer/dashboard/pets", async (req, res) => {
      const result = await petsCollection
        .find({ approved: true, adoptionStatus: "Available" })
        .toArray();
      res.send(result);
    });

    // AI Chat endpoint
    app.post("/ai-chat", async (req, res) => {
      try {
        if (!groqClient) {
          console.error("Groq client is not initialized");
          return res.status(503).json({
            error: "AI service is not available",
            details: "Configuration error",
          });
        }

        const { message } = req.body;

        const completion = await groqClient.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "You are a helpful pet adoption assistant. You can provide advice about pet care, adoption processes, and general pet-related information. Keep responses concise and friendly.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          model: "mixtral-8x7b-32768",
          temperature: 0.7,
          max_tokens: 150,
          top_p: 1,
        });

        res.json({
          response: completion.choices[0].message.content,
          usage: completion.usage,
        });
      } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({
          error: "Failed to get AI response",
          details: error.message,
        });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
