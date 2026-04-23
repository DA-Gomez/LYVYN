import express from "express";
import cors from "cors";
import db from "../config/firebase.js";
import dotenv from "dotenv";
import { spawn } from "child_process";

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

// ML integration (more in depth explanations found in test.js) >> DG
const executePython = async (script, args) => {
  const input = args.map(arg => arg.toString());
  const py = spawn("python", [script, ...input]);
  // const py = spawn("venv/Scripts/python", [script, ...input]);

  const result = await new Promise((resolve, reject) => {
    let output;

    py.stdout.on('data', (data) => {
      try {
        output = JSON.parse(data.toString()); 
      } catch (err) {
        console.error("Parse error:", data.toString());
      }
    })

    py.stderr.on("data", (data) => {
      console.error('python error: ', data.toString());
      reject('error in ', script);
    })

    py.on("exit", (code) => {
      resolve(output);
    })
  })

  return result;
};

function getOutfits(filteredClothes, requiresOuterwear) {
  const tops = filteredClothes.filter((c) => c.category === "top");
  const bottoms = filteredClothes.filter((c) => c.category === "bottom");
  const shoes = filteredClothes.filter((c) => c.category === "shoes");
  const outerwear = filteredClothes.filter((c) => c.category === "outerwear");

  const outfits = [];

  for (const t of tops) {
    for (const b of bottoms) {
      for (const s of shoes) {
        if (requiresOuterwear) {
          for (const o of outerwear) {
            outfits.push({ top: t, bottom: b, shoes: s, outerwear: o });
          }
        } else {
          outfits.push({ top: t, bottom: b, shoes: s });
        }
      }
    }
  }
  return outfits;
}

function ruleFiltering(weatherCategory, occasion, listOfClothes, clothes) {
  let filteredClothes = clothes.filter((c) => listOfClothes.includes(c.id) || listOfClothes.includes(c.category));
  let requiresOuterwear = false;

  if (weatherCategory === "cold") {
    filteredClothes = filteredClothes.filter((c) => c.warmth === "heavy" || c.warmth === "medium");
    requiresOuterwear = true;
  } 
  else if (weatherCategory === "hot") {
    filteredClothes = filteredClothes.filter((c) => c.warmth === "light" || c.warmth === "medium");
  }

  //filter by occasion (either "casual" or "formal")
  filteredClothes = filteredClothes.filter((c) => c.formality === occasion);

  return { filteredClothes, requiresOuterwear };
}

// async function recommendClothes(userInput) {
//   if (!userInput) {
//     return false;
//   }

//   const weather = userInput.weather;
//   const occasion = userInput.occasion;
//   const listOfClothes = userInput.listOfClothes;

//   if (!weather || !occasion || !Array.isArray(listOfClothes)) {
//     return false;
//   }

//   const clothes = await getClothesFromDB();
//   const { filteredClothes: filteredItems, outWear } = ruleFiltering(
//     weather,
//     occasion,
//     listOfClothes,
//     clothes
//   );

//   const outfits = getOutfits(filteredItems, outWear);

//   if (outfits.length === 0) {
//     return { message: "No match found" };
//   }

//   return outfits;
// }

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

// call ML model to recommend outfit using the actual py file >> DG
server.post("/recommend", async (req, res) => {
  console.log("POST /recommend was called");

  try {
    const { weatherCategory, occasion, listOfClothes } = req.body; //hardset rule for req.body
    if (!weatherCategory || !occasion) {
      return res.status(400).json({ error: "Missing weatherCategory or occasion in request" });
    }

    const clothes = await getClothesFromDB();
    if (clothes.length === 0) {
      return res.status(404).json({ error: "Wardrobe is empty" });
    }

    //applies rules
    const { filteredClothes, requiresOuterwear } = ruleFiltering(weatherCategory, occasion, listOfClothes, clothes);
    const validOutfits = getOutfits(filteredClothes, requiresOuterwear);
    if (validOutfits.length === 0) {
      return res.status(404).json({ message: "No match found for this weather/occasion" });
    }

    //format data for ML python and sends it
    const mlFormattedOutfits = validOutfits.map((outfit, index) => {
      let heavyCount = 0;
      Object.values(outfit).forEach(item => { if (item.warmth === "heavy") heavyCount++; });

      //rules set by model.py (subject to change)
      return {
        outfit_id: `outfit_${index}`,
        is_cold: weatherCategory === "cold" ? 1 : 0,
        has_outerwear: outfit.outerwear ? 1 : 0,
        heavy_items_count: heavyCount,
        is_formal: occasion === "formal" ? 1 : 0,
        formality_match: 1, 
        time_since_last_worn: Math.floor(Math.random() * 10) 
      };
    })

    const jsonStr = JSON.stringify(mlFormattedOutfits);
    const mlResponse = await executePython("../ml/model.py", [jsonStr]);
    if (mlResponse.error) {
      throw new Error(mlResponse.errorMessage);
    }

    //return to frontend
    //gets the ID of the best outfit so we can locate it and return its values
    const bestOutfitIDIndex = parseInt(mlResponse.best_outfit.outfit_id.split("_")[1]);//hardset rule my ML
    const finalRecommendation = validOutfits[bestOutfitIDIndex];

    res.status(200).json({
      recommendedOutfit: finalRecommendation,
      confidenceScore: mlResponse.best_outfit.ml_score
    });
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

// edit/update clothing item << DG
server.put("/clothes/:id", async (req, res) => {
  console.log(`PUT /clothes/${req.params.id} was called`);

  try {
    let id = req.params.id;
    const data = req.body; //updated data

    await db.collection("clothes").doc(id).update(data);
    res.json({ message: "Clothing item updated successfully", id });
  } catch (error) {
    console.error("Error updating clothing: ", error);
    res.status(500).json({ error: "Failed to update clothing" });
  }
})

// delete clothing item << DG
server.delete("/clothes/:id", async (req, res) => {
  console.log(`DELETE /clothes/${req.params.id} was called`);

  try {
    let id = req.params.id;

    await db.collection("clothes").doc(id).delete();
    res.json({ message: "Clothing item deleted successfully", id });
  } catch (error) {
    console.error("Error updating clothing: ", error);
    res.status(500).json({ error: "Failed to update clothing" });
  }
})

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});