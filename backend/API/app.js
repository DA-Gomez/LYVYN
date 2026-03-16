
import express from "express";
const server = express();

server.use(express.json());

const clothes = [
{
  id: 1, 
category: "shoes",
 type: "leather",
 warmth: "medium",
 formality: "formal",
colorGroup:"warm"
}, 
{
  id: 2 , 
category: "bottom",
 type:"jeans",
 warmth: "medium",
 formality: "casual",
colorGroup: "cool"
}, 
{
  id: 3 ,  
category: "outerwear",
 type: "hoodie",
 warmth: "medium",
 formality: "casual",
colorGroup: "cool"
}, 

{
  id: 4,
category: "top",
 type: "hoodie",
 warmth:  "medium",
 formality: "casual",
colorGroup: "cool"
}, 

{
  id: 5,
category: "top",
 type:  "jeans",
 warmth: "light",
 formality: "casual",
colorGroup: "neutral"
}, 

{
  id: 6,
  category: "bottom",
 type:   "jeans",
 warmth: "heavy",
 formality: "casual",
colorGroup: "warm"
},

{
  id: 7, 
   category:  "bottom",
 type:  "jeans",
 warmth:  "heavy",
 formality: "casual",
colorGroup:  "cool"
},
{
  id: 8,
  category: "shoes",
  type: "sneakers",
  warmth: "medium",
  formality: "casual",
  colorGroup: "cool"
},
{
  id: 9,
  category: "top",
  type: "hoodie",
  warmth: "heavy",
  formality: "casual",
  colorGroup: "warm"
},
{
  id: 10,
  category: "top",
  type: "hoodie",
  warmth: "light",
  formality: "casual",
  colorGroup: "neutral"
},
{
  id: 11,
  category: "top",
  type: "leather",
  warmth: "medium",
  formality: "formal",
  colorGroup: "cool"
},
{
  id: 12,
  category: "bottom",
  type: "jeans",
  warmth: "light",
  formality: "casual",
  colorGroup: "neutral"
},
{
  id: 13,
  category: "bottom",
  type: "jeans",
  warmth: "medium",
  formality: "formal",
  colorGroup: "cool"
},
{
  id: 14,
  category: "bottom",
  type: "jeans",
  warmth: "heavy",
  formality: "formal",
  colorGroup: "warm"
},
{
  id: 15,
  category: "shoes",
  type: "leather",
  warmth: "medium",
  formality: "formal",
  colorGroup: "neutral"
},
{
  id: 16,
  category: "shoes",
  type: "sneakers",
  warmth: "light",
  formality: "casual",
  colorGroup: "cool"
},
{
  id: 17,
  category: "shoes",
  type: "sneakers",
  warmth: "heavy",
  formality: "casual",
  colorGroup: "warm"
},
{
  id: 18,
  category: "outerwear",
  type: "hoodie",
  warmth: "heavy",
  formality: "casual",
  colorGroup: "neutral"
},
{
  id: 19,
  category: "outerwear",
  type: "leather",
  warmth: "medium",
  formality: "formal",
  colorGroup: "cool"
},
{
  id: 20,
  category: "outerwear",
  type: "hoodie",
  warmth: "light",
  formality: "casual",
  colorGroup: "warm"
}];


function getclothes(){
 		return clothes;
}


function addclothes(newCloth){
  
  const validCategories = clothes.map(clothItem => clothItem.category);
  const validWarmth = clothes.map(clothItem => clothItem.warmth);
  const validFormality = clothes.map(clothItem => clothItem.formality);
  const validColorGroups = clothes.map(clothItem => clothItem.colorGroup);
  const validTypes = clothes.map(clothItem => clothItem.type);
  const UsedId = clothes.map(clothItem => clothItem.id);

 
    if(!newCloth){
      return false;
    }
    if (!Number.isInteger(newCloth.id)  || UsedId.includes(newCloth.id)){
      return false;
    }if (!validCategories.includes(newCloth.category)){
      return false;
    }if (!validTypes.includes(newCloth.type)){
      return false;
    }if (!validWarmth.includes(newCloth.warmth)){
      return false;
    }if (!validFormality.includes(newCloth.formality)){
      return false;
    }if (!validColorGroups.includes(newCloth.colorGroup)){
      return false;
    }

  clothes.push(newCloth);
  return true;
}


server.post("/clothes",(req, res) => {
	console.log("POST /clothes was called");
  var isValid = addclothes(req.body);

  if (isValid === true){
  res.status(201).json(req.body);
  }
  else {
  res.status(400).json({ error: "Invalid cloth data" });
  } 
});


server.get("/clothes", (req, res) => {
	  console.log("GET /clothes was called");
  res.json(clothes);
});


server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


function getOutfits(filteredClothes, outWear){

 var tops = filteredClothes.filter(c => c.category === "top");
      var bottoms = filteredClothes.filter(c => c.category === "bottom");
      var shoes = filteredClothes.filter(c => c.category === "shoes");
      var outerwear = filteredClothes.filter(c => c.category === "outerwear");

      const outfits = [];

  if (outWear){
      for (let t of tops){
        for (let b of bottoms){
          for (let s of shoes){
            for (let o of outerwear){
              outfits.push({ top: t, bottom: b, shoes: s, outerwear: o });
            }
          }
        }
      }
    }
  else {
      for (let t of tops){
        for (let b of bottoms){
          for (let s of shoes){
              outfits.push({ top: t, bottom: b, shoes: s });
          }
        }
      }
  }
  return outfits;
}





function ruleFiltering(weather, occasion, listOfClothes){

 var filteredClothes = clothes.filter(c => listOfClothes.includes(c.id));

 var outWear = false;

if(weather === "cold" && occasion === "formal"){
  filteredClothes = filteredClothes.filter(c => (c.warmth === "heavy" || c.warmth === "medium") && c.formality === "formal");
  outWear = true;
}
else if(weather === "hot" && occasion === "formal"){
  filteredClothes = filteredClothes.filter(c => (c.warmth === "light" || c.warmth === "medium") && c.formality === "formal");
}
else if(weather === "cold" && occasion === "casual"){
  filteredClothes = filteredClothes.filter(c => (c.warmth === "heavy" || c.warmth === "medium") && c.formality === "casual");
  outWear = true;
}
else if(weather === "hot" && occasion === "casual"){
  filteredClothes = filteredClothes.filter(c => (c.warmth === "light" || c.warmth === "medium") && c.formality === "casual");
}


 return {filteredClothes , outWear};

}


function recommendClothes(UserInput){

  if(!UserInput){
    return false;
  }
  
var weather = UserInput.weather;
var occasion = UserInput.occasion;
var listOfClothes = UserInput.listOfClothes;


var {filteredClothes: clothesList, outWear } = ruleFiltering(weather, occasion, listOfClothes);

var outfit = getOutfits(clothesList, outWear);

if (outfit.length === 0) {
  return { message: "No match found" };
}

return outfit;

}


server.post("/recommend", (req,res) => {
console.log("POST /recommend was called");
const recOutfit = recommendClothes(req.body)

if (recOutfit === false){
  res.status(400).json({ error: "No user input" });
}
else{
res.status(201).json(recOutfit);
}
});
