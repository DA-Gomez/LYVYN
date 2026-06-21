const BASE_URL = "http://localhost:3000";

export async function getClothes() {
  const res = await fetch(`${BASE_URL}/clothes`);
  if (!res.ok) throw new Error("Failed to fetch clothes");
  return res.json();
}

export async function addClothingItem(item) {
  const res = await fetch(`${BASE_URL}/clothes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!res.ok) throw new Error("Failed to add clothing item");
  return res.json();
}

export async function updateClothingItem(id, updates) {
  const res = await fetch(`${BASE_URL}/clothes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!res.ok) throw new Error("Failed to update clothing item");
  return res.json();
}

export async function deleteClothingItem(id) {
  const res = await fetch(`${BASE_URL}/clothes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete clothing item");
  return res.json();
}

export async function getRecommendation(payload) {
  const res = await fetch(`${BASE_URL}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to generate recommendation");
  return res.json();
}

// GET /weather -> fetches real-time weather for the given city
// returns { city, temperature, rawCondition, tempCategory, conditionCategory, summary }
export async function getWeather() {
  const res = await fetch(`${BASE_URL}/weather`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

// records whether the user liked the recommended outfit.`feedback` must include a boolean `liked`
export async function submitFeedback(feedback) {
  const res = await fetch(`${BASE_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedback),
  });

  if (!res.ok) throw new Error("Failed to submit feedback");
  return res.json();
}
