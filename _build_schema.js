const fs=require("fs");
const L=[];
function a(s){L.push(s);}
a("generator client {");
a("  provider = "prisma-client-js");
a("}");
a("");
a("datasource db {");
a("  provider = "postgresql");
a("  url      = env("DATABASE_URL");
a("}");
fs.writeFileSync("prisma/schema.prisma", L.join("
"), "utf-8");
console.log("Schema written:", L.length, "lines");
