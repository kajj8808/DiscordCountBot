const Discord = require("discord.js");
const config = require("./config");
const fs = require("fs");
const client = new Discord.Client();

/* Count Bot  https://discord.com/developers/applications*/
const token = config.token;
const prefix = config.prefix;

let userData = {};

const saveData = () => {
  const data = JSON.stringify(userData);
  fs.writeFileSync("data/userData.json", data);
};

const loadData = () => {
  try {
    let data = fs.readFileSync("data/userData.json");
    userData = JSON.parse(data);
  } catch (error) {
    userData = {};
  }
};

const setUserData = (userName, subTitle, plus = true) => {
  if (subTitle === undefined) {
    try {
      subTitle = userData[userName].subTitle;
    } catch (error) {
      subTitle = "undefined";
    }
  }
  const number = plus ? +1 : -1;
  try {
    userData[userName] = { countValue: userData[userName].countValue + number, subTitle };
  } catch (err) {
    userData[userName] = { countValue: 0 + number, subTitle };
  }
};

const countPlus = (userName, subTitle) => {
  setUserData(userName, subTitle);
  saveData();
  return userData[userName].countValue;
};

const countMinus = (userName) => {
  setUserData(userName, undefined, false);
  saveData();
  return userData[userName].countValue;
};

const countReset = (userName) => {
  userData[userName] = null;
  saveData();
};

const ranColor = () => {
  const colors = ["#ffbe76", "#dff9fb", "#7ed6df", "#686de0", "#4834d4", "#95afc0", "#22a6b3"];
  const ranNumber = Math.floor(Math.random() * (colors.length - 0) + 0);
  return colors[ranNumber];
};

const msgEmbeds = (userName) => {
  const count = userData[userName].countValue;
  const subTitle = userData[userName].subTitle;
  if (userName === null) {
    return;
  }
  return new Discord.MessageEmbed()
    .setColor(ranColor())
    .setTitle(userName)
    .setDescription(`subTitle : ${subTitle}\ncount : ${count}`);
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  loadData();
});

client.on("message", (msg) => {
  const author = msg.author;
  if (author.bot === false) {
    if (msg.content.startsWith(`${prefix}p`)) {
      try {
        const subTitle = msg.content.split(`${prefix}p `)[1];
        countPlus(author.username, subTitle);
      } catch (err) {
        countPlus(author.username);
      }
      msg.channel.send(msgEmbeds(author.username));
    } else if (msg.content.startsWith(`${prefix}reset`)) {
      countReset(author.username);
      msg.channel.send("reset complete!")
    } else if (msg.content.startsWith(`${prefix}m`)) {
      countMinus(author.username);
      msg.channel.send(msgEmbeds(author.username));
    }
  }
});

//author bot username content
client.login(token);
