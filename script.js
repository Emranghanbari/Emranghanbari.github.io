const dataPropmt = (text) => {
    let data = window.prompt(text);
    return data;
}
let pervScores = dataPropmt("Enter Your Scores From Score Vault");
let collectedScores = dataPropmt("Enter New Daily Collcted Scores");
const rawMainScores = `
    ${pervScores}
`;
const rawNewScores = `
    ${collectedScores}
`;
const parseScores = raw => {
  const obj = {};
  raw.trim().split("\n").forEach(line => {
    if (line.includes(":")) {
      const [key, value] = line.split(":").map(x => x.trim());
      obj[key] = parseFloat(value);
    }
  });
  return obj;
};
const mainScores = parseScores(rawMainScores);
const newScores = parseScores(rawNewScores);
let summaryList = [];
for (const key in newScores) {
  if (mainScores.hasOwnProperty(key)) {
      summaryList.push({key, pervPoint: mainScores[key], collectedPoints: newScores[key], newPoint: (mainScores[key] + newScores[key])});
      mainScores[key] += newScores[key];
    }
}
const updatedList = Object.entries(mainScores)
.map(([k, v]) => `${k}: ${v}`)
.join("\n");
const scoreElement = document.getElementById("score");
scoreElement.textContent = updatedList;
Prism.highlightElement(scoreElement);
const summaryElement = document.getElementById("summary");

summaryList.forEach(item => {
    const p = document.createElement("p");
    p.textContent = `Code: ${item.key}, Pervious Point: ${item.pervPoint}, Collected points: ${item.collectedPoints}, New Point: ${item.newPoint}`;
    summaryElement.appendChild(p);
});