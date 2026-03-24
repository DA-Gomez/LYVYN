import express from "express";
import cors from "cors";
import db from "../config/firebase.js";
import dotenv from "dotenv";

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

function normalizeWeather(data) {
  const temp = data.main.temp;
  const rawCondition = data.weather[0].main.toLowerCase();

  let tempCategory = "mild";
  if (temp < 10) tempCategory = "cold";
  else if (temp >= 24) tempCategory = "hot";

  let conditionCategory = "dry";
  if (rawCondition.includes("rain") || rawCondition.includes("drizzle")) {
    conditionCategory = "rainy";
  } else if (rawCondition.includes("snow")) {
    conditionCategory = "snowy";
  }

  return {
    city: data.name,
    temperature: temp,
    rawCondition: data.weather[0].main,
    tempCategory,
    conditionCategory,
    summary: `${tempCategory}, ${temp}°C, ${data.weather[0].main}`,
  };
}

function validateCloth(newCloth) {
  const validCategories = ["shoes", "bottom", "outerwear", "top"];
  const validWarmth = ["light", "medium", "heavy"];
  const validFormality = ["formal", "casual"];
  const validColorGroups = ["warm", "cool", "neutral"];

  if (!newCloth) return false;
  if (!validCategories.includes(newCloth.category)) return false;
  if (!newCloth.type || typeof newCloth.type !== "string") return false;
  if (!validWarmth.includes(newCloth.warmth)) return false;
  if (!validFormality.includes(newCloth.formality)) return false;
  if (!validColorGroups.includes(newCloth.colorGroup)) return false;

  return true;
}

async function getClothesFromDB() {
  const snapshot = await db.collection("clothes").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

async function addClothToDB(newCloth) {
  if (!validateCloth(newCloth)) {
    return false;
  }

  const clothData = {
    ...newCloth,
    type: newCloth.type.toLowerCase().trim(),
  };

  const docRef = await db.collection("clothes").add(clothData);

  return {
    id: docRef.id,
    ...clothData,
  };
}

function getOutfits(filteredClothes, outWear) {
  const tops = filteredClothes.filter((c) => c.category === "top");
  const bottoms = filteredClothes.filter((c) => c.category === "bottom");
  const shoes = filteredClothes.filter((c) => c.category === "shoes");
  const outerwear = filteredClothes.filter((c) => c.category === "outerwear");

  const outfits = [];

  if (outWear) {
    for (const t of tops) {
      for (const b of bottoms) {
        for (const s of shoes) {
          for (const o of outerwear) {
            outfits.push({ top: t, bottom: b, shoes: s, outerwear: o });
          }
        }
      }
    }
  } else {
    for (const t of tops) {
      for (const b of bottoms) {
        for (const s of shoes) {
          outfits.push({ top: t, bottom: b, shoes: s });
        }
      }
    }
  }

  return outfits;
}

function ruleFiltering(weather, occasion, listOfClothes, clothes) {
  let filteredClothes = clothes.filter(
    (c) => listOfClothes.includes(c.id) || listOfClothes.includes(c.category)
  );

  let outWear = false;

  if (weather === "cold" && occasion === "formal") {
    filteredClothes = filteredClothes.filter(
      (c) =>
        (c.warmth === "heavy" || c.warmth === "medium") &&
        c.formality === "formal"
    );
    outWear = true;
  } else if (weather === "hot" && occasion === "formal") {
    filteredClothes = filteredClothes.filter(
      (c) =>
        (c.warmth === "light" || c.warmth === "medium") &&
        c.formality === "formal"
    );
  } else if (weather === "cold" && occasion === "casual") {
    filteredClothes = filteredClothes.filter(
      (c) =>
        (c.warmth === "heavy" || c.warmth === "medium") &&
        c.formality === "casual"
    );
    outWear = true;
  } else if (weather === "hot" && occasion === "casual") {
    filteredClothes = filteredClothes.filter(
      (c) =>
        (c.warmth === "light" || c.warmth === "medium") &&
        c.formality === "casual"
    );
  }

  return { filteredClothes, outWear };
}

async function recommendClothes(userInput) {
  if (!userInput) {
    return false;
  }

  const weather = userInput.weather;
  const occasion = userInput.occasion;
  const listOfClothes = userInput.listOfClothes;

  if (!weather || !occasion || !Array.isArray(listOfClothes)) {
    return false;
  }

  const clothes = await getClothesFromDB();
  const { filteredClothes: filteredItems, outWear } = ruleFiltering(
    weather,
    occasion,
    listOfClothes,
    clothes
  );

  const outfits = getOutfits(filteredItems, outWear);

  if (outfits.length === 0) {
    return { message: "No match found" };
  }

  return outfits;
}

server.get("/clothes", async (req, res) => {
  console.log("GET /clothes was called");

  try {
    const clothes = await getClothesFromDB();
    console.log("Firestore clothes count:", clothes.length);
    res.json(clothes);
  } catch (error) {
    console.error("Error fetching clothes:", error);
    res.status(500).json({ error: "Failed to fetch clothes" });
  }
});

server.post("/clothes", async (req, res) => {
  console.log("POST /clothes was called");

  try {
    const createdCloth = await addClothToDB(req.body);

    if (createdCloth) {
      res.status(201).json(createdCloth);
    } else {
      res.status(400).json({ error: "Invalid cloth data" });
    }
  } catch (error) {
    console.error("Error adding cloth:", error);
    res.status(500).json({ error: "Failed to add clothing item" });
  }
});

server.post("/recommend", async (req, res) => {
  console.log("POST /recommend was called");

  try {
    const recOutfit = await recommendClothes(req.body);

    if (recOutfit === false) {
      res.status(400).json({ error: "No user input" });
    } else {
      res.status(201).json(recOutfit);
    }
  } catch (error) {
    console.error("Error generating recommendation:", error);
    res.status(500).json({ error: "Failed to generate recommendation" });
  }
});

server.post("/feedback", async (req, res) => {
  console.log("POST /feedback was called");

  try {
    const feedback = req.body;

    if (!feedback || typeof feedback.liked !== "boolean") {
      return res.status(400).json({ error: "Invalid feedback data" });
    }

    const feedbackData = {
      ...feedback,
      timestamp: new Date().toISOString(),
    };

    const docRef = await db.collection("feedback").add(feedbackData);

    res.status(201).json({
      id: docRef.id,
      ...feedbackData,
    });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

server.get("/weather", async (req, res) => {
  console.log("GET /weather was called");

  try {
    const city = req.query.city || "Toronto";
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(400)
        .json({ error: "Failed to fetch weather", details: data });
    }

    const normalized = normalizeWeather(data);
    res.json(normalized);
  } catch (error) {
    console.error("Weather route error:", error);
    res.status(500).json({ error: "Weather route failed" });
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});