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
export async function sendFeedback(payload) {
  const res = await fetch(`${BASE_URL}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to save feedback");
  return res.json();
}