var rp = require('request-promise');
const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:password@35.187.225.49:27017');
var Record = mongoose.model('Record', {
  time: Number,
  userid: String,
  text: String
});
var Follower = mongoose.model('Follower', {
  time: Number,
  userid: String,
});
exports.reply = function justReply(req, res) {
  const promises = req.body.events.map(event => {
    if (event.message.type === 'text') {
    var log = new Record();
    log.time = event.timestamp;
    log.userid = event.source.userId;
    log.text = event.message.text;
    log.save();
    var msg = event.message.text;
    var reply_token = event.replyToken;

    var lineReply_options = {
      method: 'POST',
      uri: "https://api.line.me/v2/bot/message/reply",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        "Authorization": 'Bearer c/XMmaPokDjHzMTNmPed0Mjtf3UZ8S/9+tTB08iIELrmaP5vydkuPLQVPMat1cfVV4H4dfFph4sc1S91OSOg8PWmSg1JbGIyXP7WJvZ1e2X3LJ0zCdKQsk4OS0QkCzlvVY3GqF8UOPa6hGJixR99KgdB04t89/1O/w1cDnyilFU='
      },
      json: true,
      body: {
        replyToken: reply_token,
        messages: [
          {
            type: 'text',
            text: event.message.text
          }
        ]
      }
    };
    return rp(lineReply_options);
  }
    else if(event.type === 'follow'){
      var log = new Follower();
      log.time = event.timestamp;
      log.userid = event.source.userId;
      log.save();
    }else{
      console.log('other');
    }

  });

  Promise
    .all(promises)
    .catch(function (err) {
      console.log(err);
    })
    .then(() => res.json({ success: true }));

};