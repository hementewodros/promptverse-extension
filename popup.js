let data = [];
let selectedTag = "";

// Load JSON
fetch("prompts.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    loadSavedTag();
  });

// Elements
const tagInput = document.getElementById("tagInput");
const tagSuggestions = document.getElementById("tagSuggestions");
const promptSearch = document.getElementById("promptSearch");
const promptList = document.getElementById("promptList");
const toast = document.getElementById("toast");

// Get unique tags
function getTags() {
  return [...new Set(data.map(item => item.tag))];
}

// STEP 1: Tag search
tagInput.addEventListener("input", () => {
  const value = tagInput.value.toLowerCase();
  tagSuggestions.innerHTML = "";

  const filtered = getTags().filter(tag =>
    tag.toLowerCase().includes(value)
  );

  filtered.forEach(tag => {
    const li = document.createElement("li");
    li.textContent = tag;
    li.onclick = () => selectTag(tag);
    tagSuggestions.appendChild(li);
  });
});

// Select tag
function selectTag(tag) {
  selectedTag = tag;
  tagInput.value = tag;
  tagSuggestions.innerHTML = "";
  promptSearch.classList.remove("hidden");

  localStorage.setItem("lastTag", tag);
  renderPrompts();
}

// STEP 2: Prompt search
promptSearch.addEventListener("input", renderPrompts);

// Render prompts
function renderPrompts() {
  const keyword = promptSearch.value.toLowerCase();
  promptList.innerHTML = "";

  const filtered = data.filter(item =>
    item.tag === selectedTag &&
    item.amharic_prompt.toLowerCase().includes(keyword)
  );

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="amharic">${highlight(item.amharic_prompt, keyword)}</div>
      <div class="english">${item.english_translation}</div>
      <button>Copy</button>
    `;

    card.querySelector("button").onclick = () => copyText(item.amharic_prompt);

    promptList.appendChild(card);
  });
}

// Copy function
function copyText(text) {
  navigator.clipboard.writeText(text);
  showToast();
}

// Toast
function showToast() {
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 1500);
}

// Highlight matches
function highlight(text, keyword) {
  if (!keyword) return text;
  return text.replace(
    new RegExp(keyword, "gi"),
    match => `<mark>${match}</mark>`
  );
}

// Load saved tag
function loadSavedTag() {
  const saved = localStorage.getItem("lastTag");
  if (saved) {
    selectTag(saved);
  }
}