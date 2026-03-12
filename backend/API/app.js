
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
 type:"hoodie",
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
}

];



function getclothes(){
 		return clothes;
}


function addclothes(newCloth){
  
  const validCategories = ["shoes", "bottom", "outerwear", "top"];
  const validWarmth = ["light", "medium", "heavy"];
  const validFormality = ["formal", "casual"];
  const validColorGroups = ["warm", "cool", "neutral"];
  const validTypes = ["leather", "hoodie", "jeans"];
  const UsedId = [1, 2, 3, 4, 5, 6, 7];

 
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


function recommendClothes(UserInput){

}

server.post("/recommend", (req,res) => {
const recOutfit = recommendClothes(req.body)
res.status(201).json(recOutfit);

});
