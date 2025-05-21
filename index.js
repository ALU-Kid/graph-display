const express = require("express");
const path = require("path");
require("dotenv").config();
const fastify = require("fastify")({ logger: false });

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/",
});
fastify.register(require("@fastify/formbody"));
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

let queue = [
  "My soldiers rage!!",
  "EV Gang or Nothing",
  "No excuses, only electrons."
];

fastify.get("/", function (req, reply) {
  const params = {
    greeting: "Welcome, Ira!",
    queue: queue,
    nextMessage: queue[0],
    stats: {
      kwh: 132.5,
      sessions: 28,
      weather: "⛅ 27°C in Kigali",
    },
  };
  return reply.view("/src/pages/index.hbs", params);
});

fastify.post("/add", function (req, reply) {
  const newMessage = req.body.newMessage;
  if (newMessage && newMessage.trim() !== "") {
    queue.push(newMessage.trim());
  }
  reply.redirect("/");
});

fastify.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`App running on ${address}`);
});
