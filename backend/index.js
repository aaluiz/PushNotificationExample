const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Set static path for on
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicVapidKey =
  "BDw8TR0ytOUsWJrg8doYoUuus-O_yAkuoEoJEiqo2asZlEkpVjRIPXve-_9Nbck5qPuK98b9N0QZ3kz-iO3Ap1Q";
const privateVapidKey = "hnB8BfheFkZMqzupjIRplLTsEiD-dukeDDf5GozyAE0";

webpush.setVapidDetails(
  "mailto:aaluiz@gmail.com",
  publicVapidKey,
  privateVapidKey
);

const dummyDb = [{ subscription: null }]; //dummy in memory store
const saveToDatabase = async (subscription) => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  if (!dummyDb.find((x) => x.subscription === subscription)){
      dummyDb.push({ subscription: subscription});
  }
};

//subscribe route
app.post("/subscribe", (req, res) => {
  // Get pushsubscription objet
  const subscription = req.body;
  saveToDatabase(subscription);

  //Send 201 - resource created
  res.status(201).json({});

  //Create payload
  const payload = JSON.stringify({ title: "Push Test" });

  //Pass objet into SendNotification
  webpush
    .sendNotification(subscription, payload)
    .catch((err) => console.error(err));
});

//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
  console.log(new Date());
  webpush.sendNotification(subscription, dataToSend);
};
//route to test send notification
app.get("/send-notification", (req, res) => {
  const subscription = dummyDb.subscription; //get subscription from your databse here.
  const message =JSON.stringify({ title: "Notificacao" })
  dummyDb.forEach((record) => {
      sendNotification(record.subscription, message);
  })
  res.json({ message: "message sent" });
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
