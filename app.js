
import express from "express";
const server = express();

server.use(express.json());

const clothes = [
{
  id: 1, 
category: "shoes",
 type: "lather",
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
	clothes.push({cloth});
		return cloth;
}


server.get("/clothes", (req, res) => {
	  console.log("GET /clothes was called");
  res.json(clothes);
});


server.post("/clothes",(req, res) => {
	console.log("POST /clothes was called");
  const newCloth = addclothes(req.body);
  res.status(201).json(newCloth);
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
