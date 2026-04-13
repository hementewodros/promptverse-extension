let data = [];
let selectedTag = "";

fetch("prompts.json")
  .then(res => res.json())
  .then(json => data = json);

const tagInput = document.getElementById("tagInput");
const tagSuggestions = document.getElementById("tagSuggestions");
const promptSearch = document.getElementById("promptSearch");
const promptList = document.getElementById("promptList");

function getTags() {
  return [...new Set(data.map(item => item.tag))];
}

tagInput.addEventListener("input", () => {
  tagSuggestions.innerHTML = "";
  const value = tagInput.value.toLowerCase();

  getTags()
    .filter(tag => tag.toLowerCase().includes(value))
    .forEach(tag => {
      const li = document.createElement("li");
      li.textContent = tag;
      li.onclick = () => selectTag(tag);
      tagSuggestions.appendChild(li);
    });
});

function selectTag(tag) {
  selectedTag = tag;
  tagInput.value = tag;
  tagSuggestions.innerHTML = "";
  renderPrompts();
}

promptSearch.addEventListener("input", renderPrompts);

function renderPrompts() {
  const keyword = promptSearch.value.toLowerCase();
  promptList.innerHTML = "";

  data
    .filter(item =>
      item.tag === selectedTag &&
      item.amharic_prompt.toLowerCase().includes(keyword)
    )
    .forEach(item => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <b>${item.amharic_prompt}</b><br>
        <small>${item.english_translation}</small><br>
        <button onclick="copyText('${item.amharic_prompt}')">Copy</button>
      `;

      promptList.appendChild(div);
    });
}

function copyText(text) {
  navigator.clipboard.writeText(text);
  alert("Copied!");
}