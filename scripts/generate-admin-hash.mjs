import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run admin:hash -- <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
const escapedHash = hash.replace(/\$/g, "\\$");

console.log(`Password: ${password}`);
console.log(`Bcrypt:   ${hash}`);
console.log(`.env:     ${escapedHash}`);
