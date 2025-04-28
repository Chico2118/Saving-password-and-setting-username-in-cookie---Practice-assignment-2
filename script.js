const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById("pin");
const sha256HashView = document.getElementById("sha256-hash");
const resultView = document.getElementById("result");

// a function to store in the local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// a function to retrieve from the local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// a function to clear the local storage
function clearStorage() {
  localStorage.clear();
}

// a function to generate a random 3-digit number
function getRandom3DigitNumber() {
  return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

// a function to generate sha256 hash of the given string
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

// Generate and store the random 3-digit number and its hash
async function getSHA256Hash() {
  let cachedHash = retrieve("sha256");
  let cachedPin = retrieve("pin");

  if (cachedHash && cachedPin) {
    return cachedHash;
  }

  const randomPin = getRandom3DigitNumber().toString();
  const hash = await sha256(randomPin);

  store("pin", randomPin);
  store("sha256", hash);

  return hash;
}

// Show the hash on the page
async function main() {
  sha256HashView.innerHTML = "Calculating...";
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

// Check if the user's input matches
async function test() {
  const pin = pinInput.value.trim();

  if (pin.length !== 3) {
    resultView.innerHTML = "💡 Please enter a 3-digit number.";
    resultView.classList.remove("hidden");
    return;
  }

  const correctPin = retrieve("pin");

  if (!correctPin) {
    resultView.innerHTML = "⚠️ Something went wrong. Refresh and try again.";
    resultView.classList.remove("hidden");
    return;
  }

  if (pin === correctPin) {
    resultView.innerHTML = "🎉 Correct! You found the number!";
    resultView.classList.add("success");
  } else {
    resultView.innerHTML = "❌ Incorrect! Try again.";
    resultView.classList.remove("success");
  }
  resultView.classList.remove("hidden");
}

// Allow only numbers and max 3 digits
pinInput.addEventListener("input", (e) => {
  const { value } = e.target;
  pinInput.value = value.replace(/\D/g, "").slice(0, 3);
});

// Attach the test function to the button
document.getElementById("check").addEventListener("click", test);

// Run the main function
main();
