const fs = require('fs');
let code = fs.readFileSync('src/services/emailService.ts', 'utf-8');

// Replace all resend calls cleanly to avoid scoping issues.
let counter = 0;
code = code.replace(/const resendResponse = await resend\.emails\.send\(\{([\s\S]*?)\}\);\n    if \(resendResponse\.error\) \{\n      console\.error\('Resend Error:', error\);\n      throw new Error\(resendResponse\.error\.message\);\n    \}/g, (match, contents) => {
  counter++;
  return `const resendResponse${counter} = await resend.emails.send({${contents}});\n    if (resendResponse${counter}.error) {\n      console.error('Resend Error:', resendResponse${counter}.error);\n      throw new Error(resendResponse${counter}.error.message);\n    }`;
});

fs.writeFileSync('src/services/emailService.ts', code);
