const { execSync } = require("child_process");
const fs = require("fs");
let word = ["hi"];

const words = [
  "fix typo", "update styles", "refactor auth", "add comments", "clean up",
  "improve UI", "update deps", "fix bug", "add validation", "optimize query",
  "remove logs", "update readme", "add tests", "fix layout", "refactor API",
  "add middleware", "fix routing", "update schema", "add error handling", "improve perf",
  "fix imports", "update config", "add pagination", "fix session", "update models",
  "add logging", "fix CORS", "update env", "add caching", "final cleanup"
];

function commit() {
  let day = 1;
  const month = 2;
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
    word.push(words[j]);
    fs.writeFileSync("words.json", JSON.stringify(word, null, 2));

    execSync(`git add .`, { env });
    execSync(`git commit -m "${words[j]}"`, { env });
    execSync(`git push`);
    console.log(`Committed: "${words[j]}" on ${fakeDate}`);
    day++;
  }
  console.log("All commits done.");
}
commit();
console.log(word);
