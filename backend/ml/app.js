
import express from "express";
import { number } from "yargs";
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



function getclothes(id){
 for(let i = 0; i < clothes.length ; i++){
 	if (clothes[i].id === id){
 		return clothes[i];
 	}
}
}


function addclothes(cloth){
  for(let i = 0; i < clothes.length ; i++){
    if (clothes[i].id !== number & clothes[i].id !== any(clothes.id)){
      return false;
    }if (clothes[i].category !== any(clothes.category)){
      return false;
    }if (clothes[i].type !== any(clothes.type)){
      return false;
    }if (clothes[i].warmth !== any(clothes.warmth)){
      return false;
    }if (clothes[i].formality !== any(clothes.formality)){
      return false;
    }if (clothes[i].colorGroup !==  any(clothes.colorGroup)){
      return false;
    }
  }
  clothes.push(cloth);
  return true;
}

function recommendClothes(UserInput){

}


server.get("/clothes", (req, res) => {
	  console.log("GET /clothes was called");
  res.json(clothes);
});


server.post("/clothes",(req, res) => {
	console.log("POST /clothes was called");
  const newCloth = addclothes(req.body);

if (newCloth === true){
res.status(201).json(newCloth);
}
else {
res.status(400).json({ error: "Invalid cloth data" });
} 
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

server.post("/recommend", (req,res) => {
const input = req.body;




});
