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
    const fakeDate = `${year}-${mm}-${dd}T12:00:00`;

    const env = {
      ...process.env,
      GIT_AUTHOR_DATE: fakeDate,
      GIT_COMMITTER_DATE: fakeDate,
    };
    word.push(words[j])

    execSync(`git add .`, { env });
    execSync(`git commit -m "${words[j]}" --allow-empty`, { env });
    execSync(`git push`);
    console.log(`Committed: "${words[j]}" on ${fakeDate}`);
    day++;
  }
  console.log("All commits done.");
}
commit();
console.log(word);
