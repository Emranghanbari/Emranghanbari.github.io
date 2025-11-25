document.getElementById('processBtn').addEventListener('click', () => {
  const rawMainScores = document.getElementById('prevScores');
  const rawNewScores = document.getElementById('collctedScores');

  if (!rawMainScores.value.trim() || !rawNewScores.value.trim()) {
    alert('Both fields are required!');
    return;
  }

  const parseScores = (raw) => {
    const obj = {};
    raw
      .trim()
      .split('\n')
      .forEach((line, idx) => {
        if (line.includes(':')) {
          const [key, value] = line.split(':').map((x) => x.trim());

          // validate key
          if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
            throw new Error(`Invalid key format at line ${idx + 1}: "${key}"`);
          }

          // validate value
          const num = Number(value);
          if (isNaN(num)) {
            throw new Error(`Invalid number for key "${key}"`);
          }

          obj[key] = num;
        }
      });
    return obj;
  };

  try {
    const mainScores = parseScores(rawMainScores.value);
    const newScores = parseScores(rawNewScores.value);

    rawMainScores.value = '';
    rawNewScores.value = '';

    let summaryList = [];
    for (const key in newScores) {
      if (mainScores.hasOwnProperty(key)) {
        summaryList.push({
          key,
          pervPoint: mainScores[key],
          collectedPoints: newScores[key],
          newPoint: mainScores[key] + newScores[key],
        });
        mainScores[key] += newScores[key];
      }
    }

    const updatedList = `💫موجودی امتیاز 
${Object.entries(mainScores)
  .map(([k, v]) => `${k}: ${v}`)
  .join('\n')}
    `;

    const scoreElement = document.getElementById('score');
    scoreElement.textContent = updatedList;
    Prism.highlightElement(scoreElement);

    const summaryElement = document.getElementById('summary');
    summaryElement.innerHTML = ''; // پاکسازی قبل از رندر

    const resultBox = document.getElementById('result');
    resultBox.classList.remove('hidden');

    summaryList.forEach((item) => {
      const p = document.createElement('p');
      p.textContent = `Code: ${item.key}, Previous: ${item.pervPoint}, Collected: ${item.collectedPoints}, New: ${item.newPoint}`;
      summaryElement.appendChild(p);
    });
  } catch (err) {
    alert(err.message);
  }
});
