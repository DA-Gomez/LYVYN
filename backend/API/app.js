import express from "express";
import cors from "cors";

const server = express();

server.use(cors());
server.use(express.json());

const clothes = [
  {
    id: 1,
    category: "shoes",
    type: "leather",
    warmth: "medium",
    formality: "formal",
    colorGroup: "warm",
  },
  {
    id: 2,
    category: "bottom",
    type: "jeans",
    warmth: "medium",
    formality: "casual",
    colorGroup: "cool",
  },
  {
    id: 3,
    category: "outerwear",
    type: "hoodie",
    warmth: "medium",
    formality: "casual",
    colorGroup: "cool",
  },
  {
    id: 4,
    category: "top",
    type: "hoodie",
    warmth: "medium",
    formality: "casual",
    colorGroup: "cool",
  },
  {
    id: 5,
    category: "top",
    type: "jeans",
    warmth: "light",
    formality: "casual",
    colorGroup: "neutral",
  },
  {
    id: 6,
    category: "bottom",
    type: "jeans",
    warmth: "heavy",
    formality: "casual",
    colorGroup: "warm",
  },
  {
    id: 7,
    category: "bottom",
    type: "jeans",
    warmth: "heavy",
    formality: "casual",
    colorGroup: "cool",
  },
];

function getclothes() {
  return clothes;
}

function addclothes(newCloth) {
  const validCategories = ["shoes", "bottom", "outerwear", "top"];
  const validWarmth = ["light", "medium", "heavy"];
  const validFormality = ["formal", "casual"];
  const validColorGroups = ["warm", "cool", "neutral"];

  if (!newCloth) {
    return false;
  }
  if (!validCategories.includes(newCloth.category)) {
    return false;
  }
  if (!newCloth.type || typeof newCloth.type !== "string") {
    return false;
  }
  if (!validWarmth.includes(newCloth.warmth)) {
    return false;
  }
  if (!validFormality.includes(newCloth.formality)) {
    return false;
  }
  if (!validColorGroups.includes(newCloth.colorGroup)) {
    return false;
  }

  const newId =
    clothes.length > 0 ? Math.max(...clothes.map((item) => item.id)) + 1 : 1;

  const clothWithId = {
    id: newId,
    ...newCloth,
    type: newCloth.type.toLowerCase().trim(),
  };

  clothes.push(clothWithId);
  return clothWithId;
}

server.get("/clothes", (req, res) => {
  console.log("GET /clothes was called");
  res.json(getclothes());
});

server.post("/clothes", (req, res) => {
  console.log("POST /clothes was called");

  const createdCloth = addclothes(req.body);

  if (createdCloth) {
    res.status(201).json(createdCloth);
  } else {
    res.status(400).json({ error: "Invalid cloth data" });
  }
});

function recommendClothes(userInput) {
  if (!userInput) {
    return false;
  }

  const weather = userInput.weather;
  const occasion = userInput.occasion;
  const listOfClothes = userInput.listOfClothes;

  if (!weather || !occasion || !Array.isArray(listOfClothes)) {
    return false;
  }

  const recommendedOutfit = [];

  if (weather === "hot" && occasion === "casual") {
    for (let i = 0; i < clothes.length; i++) {
      if (
        clothes[i].warmth === "light" &&
        clothes[i].formality === "casual" &&
        listOfClothes.includes(clothes[i].category)
      ) {
        recommendedOutfit.push(clothes[i]);
      }
    }
  } else if (weather === "hot" && occasion === "formal") {
    for (let i = 0; i < clothes.length; i++) {
      if (
        clothes[i].warmth === "light" &&
        clothes[i].formality === "formal" &&
        listOfClothes.includes(clothes[i].category)
      ) {
        recommendedOutfit.push(clothes[i]);
      }
    }
  } else if (weather === "cold" && occasion === "casual") {
    for (let i = 0; i < clothes.length; i++) {
      if (
        (clothes[i].warmth === "heavy" || clothes[i].warmth === "medium") &&
        clothes[i].formality === "casual" &&
        listOfClothes.includes(clothes[i].category)
      ) {
        recommendedOutfit.push(clothes[i]);
      }
    }
  } else if (weather === "cold" && occasion === "formal") {
    for (let i = 0; i < clothes.length; i++) {
      if (
        (clothes[i].warmth === "heavy" || clothes[i].warmth === "medium") &&
        clothes[i].formality === "formal" &&
        listOfClothes.includes(clothes[i].category)
      ) {
        recommendedOutfit.push(clothes[i]);
      }
    }
  }

  return recommendedOutfit;
}

server.post("/recommend", (req, res) => {
  console.log("POST /recommend was called");

  const recOutfit = recommendClothes(req.body);

  if (recOutfit === false) {
    res.status(400).json({ error: "No user input" });
  } else {
    res.status(201).json(recOutfit);
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});