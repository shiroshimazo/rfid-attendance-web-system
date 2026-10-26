const fs = require('fs');
let content = fs.readFileSync('src/features/calendar/email.ts', 'utf8');
content = content.replace(/&/g, '&')
  .replace(/</g, '<')
  .replace(/>/g, '>')
  .replace(/\"/g, '"')
  .replace(/&#039;/g, "&#039;");
fs.writeFileSync('src/features/calendar/email.ts', content);
console.log('Fixed');