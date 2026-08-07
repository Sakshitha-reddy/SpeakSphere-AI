export async function askGemini(message) {
  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    return data.reply;
  } catch (error) {
    console.error(error);
    return "Sorry, I'm having trouble responding right now.";
  }
}