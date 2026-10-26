const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3030;
const mongoUri = process.env.MONGODB_URI || 'mongodb://mongo_db:27017/';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const reviewsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'reviews.json'), 'utf8')
);
const dealershipsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data', 'dealerships.json'), 'utf8')
);

mongoose.connect(mongoUri, { dbName: 'dealershipsDB' });

const Reviews = require('./review');
const Dealerships = require('./dealership');

async function seedDatabase() {
  try {
    await Reviews.deleteMany({});
    await Dealerships.deleteMany({});
    await Reviews.insertMany(reviewsData.reviews);
    await Dealerships.insertMany(dealershipsData.dealerships);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();

app.get('/', async (req, res) => {
  res.send('Welcome to the Mongoose API');
});

app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchReviews/dealer/:id', async (req, res) => {
  try {
    const documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealers', async (req, res) => {
  try {
    const documents = await Dealerships.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealers/:state', async (req, res) => {
  try {
    const documents = await Dealerships.find({ state: req.params.state });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.get('/fetchDealer/:id', async (req, res) => {
  try {
    const documents = await Dealerships.find({ id: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.post('/insert_review', express.raw({ type: '*/*' }), async (req, res) => {
  const data = JSON.parse(req.body.toString());
  const documents = await Reviews.find().sort({ id: -1 }).exec();
  const latestReview = documents[0] || { id: 0 };
  const newId = latestReview.id + 1;

  const review = new Reviews({
    id: newId,
    name: data.name,
    dealership: data.dealership,
    review: data.review,
    purchase: data.purchase,
    purchase_date: data.purchase_date,
    car_make: data.car_make,
    car_model: data.car_model,
    car_year: data.car_year
  });

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
