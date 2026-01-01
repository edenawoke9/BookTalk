const { execSync } = require("child_process");
let word=["hi"]

const words = [
  "apple", "mountain", "journey", "bright", "silence",
  "freedom", "whisper", "ocean", "candle", "thunder",
  "forest", "mirror", "golden", "horizon", "courage",
  "puzzle", "velocity", "lantern", "destiny", "shadow",
  "crystal", "galaxy", "harmony", "phoenix", "marble",
  "sunrise", "breeze", "summit", "echo", "voyage"
];

function commit() {
  let day = 1;
  const month = 1;
  const year = 2026;

  for (let j = 0; j < words.length; j++) {
    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    // macOS date format: MMDDHHmmYYYY
  
    execSync(`sudo date ${mm}${dd}1200${year}`);
    word.push(words[j])
    execSync(`git add .`);
    execSync(`git commit -m "${words[j]}" --allow-empty`);
    execSync(`git push`);
    day++;
  }
  console.log("Commit completed");
}

commit();