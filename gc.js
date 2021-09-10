require("dotenv").config();

const { Client, User } = require("./src/");

const client = new Client(process.env.DISCORD_TOKEN);

function mem() { 
  return Object.entries(process.memoryUsage())
    .map(([key, value]) => `${key}: ${value / 1024 / 1024}`)
    .join("\n");
};

let i = 1000000;

while (i--) {
  client.users.add(`532294395655880705${i}`, new User({
    id: '532294395655880705',
    flags: 1,
    bot: false,
    system: false,
    username: 'Jessica Monroe',
    discriminator: '0649',
    avatar: '813805f1b5aa54000a5893b2a05bcb8c'
  }));
}

console.log(mem(), '\n');
gc();
console.log(mem(), '\n');

setInterval(() => {
    console.log(`Size: ${client.users.size}`);
    gc();
    console.log(mem(), '\n');
}, 60000); 

