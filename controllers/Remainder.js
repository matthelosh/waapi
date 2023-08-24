const schedule = require('node-schedule');

const Remind = {
  seragam: () => {
    schedule.scheduleJob("20 * * * * *", () => {
      console.log("Tes");
    })
  }
}

module.exports = Remind
