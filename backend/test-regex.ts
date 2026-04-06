const senderName = "Recruiter";
const senderAddress = "Hirevia <mehtasatyamm12@gmail.com>";

const fromField = senderAddress.includes('<') ? senderAddress : `"${senderName}" <${senderAddress}>`;
console.log(fromField);
