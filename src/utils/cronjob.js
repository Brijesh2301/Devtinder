const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequest = require("../models/connectionRequest");

cron.schedule(" 16 00 * * *", async () => {
  // Send email to all pepole who got request the previous day
  // console.log("hello world",  new Date());
  try {
    const yesterday = subDays(new Date(), 0);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];
    console.log("listOfEmails", listOfEmails);

    for (const email of listOfEmails) {
      //send Emails

      try {
        const res = await sendEmail.run(
          " New  Friend Requests Pendig for " + email,
          "There are so many user so PLease login to accept or reject the requests",
        );
        console.log(res);
      } catch (err) {
        throw new Error("Failed to send email to " + email);
      }
    }
  } catch (err) {}
});
