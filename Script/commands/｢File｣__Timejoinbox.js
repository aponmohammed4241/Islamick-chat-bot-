module.exports.config = {
    name: 'timejoinbox',
    version: '10.02',
    hasPermssion: 0,
    credits: 'my master apon',
    description: 'group join time box',
    commandCategory: 'time box',
    usages: '{...reply || tags}\n{all || list}',
    cooldowns: 3,
};
const {
    readFileSync,
    writeFileSync,
    mkdirSync,
    existsSync
} = require('fs-extra'),// npm install fs-extra
destD = __dirname + '/cache/timejoinbox',
newUser = a => new Object({
    id: a, timestamp: Date.now()+25200000
}),
checkNum = a => Math.floor(a) < 10?'0'+Math.floor(a): Math.floor(a);
etnTime = a => `${checkNum(a/(60*60*1000)%24)}:${checkNum(a/(60*1000)%60)}:${checkNum(a/(1000)%60)} | ${checkNum(a/(24*60*60*1000)%30)}/${checkNum(a/(30*24*60*60*1000)%12)}/${checkNum(a/(12*30*24*60*60*1000))}`,
sortCompare = k => (a, b) => (a[k] > b[k] ? 1: a[k] < b[k] ? -1: 0),
name = a => global.data.userName.get(a);
module.exports.onLoad = function() {
    if (!existsSync(destD)) mkdirSync(destD);
};
module.exports.run = function( {
    api, event, args
}) {
    const out = (a, b, c, d) => api.sendMessage(`${a}`, b?b: event.threadID, c?c: null, d?d: event.messageID);
    if(!event.isGroup) return out(`•—»✨ 𝐎𝐍𝐋𝐘 𝐖𝐎𝐑𝐊𝐒 𝐈𝐍 𝐆𝐑𝐎𝐔𝐏`)
    const destF = destD + '/' + event.threadID + '.json',
    dataF = JSON.parse(readFileSync(destF, 'utf-8'));
    dataF.user.sort(sortCompare('timestamp'));
    if (/all|list/.test(args[0])) return out(dataF.user.map((d, idx)=> `${idx+1}. ${name(d.id)}\n•—»✨ 𝐘𝐎𝐔 𝐉𝐔𝐒𝐓 𝐒𝐓𝐎𝐋𝐄 𝐌𝐃 𝐑𝐀𝐉𝐈𝐁 𝐈𝐒 𝐀 𝐏𝐎𝐎𝐑 𝐏𝐄𝐑𝐒𝐎𝐍.𝐒𝐎 𝐘𝐎𝐔 𝐇𝐀𝐕𝐄 𝐍𝐎𝐓𝐇𝐈𝐍𝐆 ${(x = JSON.stringify(new Date(d.timestamp)).split(/\.|T/), `${x[1]} | ${x[0].replace(/"/, '')}`)}\n•—»✨ 𝐏𝐀𝐒𝐒𝐄𝐃 ${etnTime((Date.now()+25200000)-d.timestamp)}`).join('\n\n'));
    const id = event.type == 'message_reply'?event.messageReply.senderID: (x0 = Object.keys(event.mentions), x0 != 0)?x0[0]: event.senderID;
    findID = dataF.user.find(i => i.id == id);
    out(`•—»✨ 𝐍𝐀𝐌𝐄: ${name(findID.id)}\n•—»✨ 𝐉𝐎𝐈𝐍 𝐍𝐎𝐖 ${(x = JSON.stringify(new Date(findID.timestamp)).split(/\.|T/), `${x[1]} | ${x[0].replace(/"/, '')}`)}\n•—»✨ 𝐍𝐀𝐌𝐄 ${etnTime((Date.now()+25200000)-findID.timestamp)}`);
};
module.exports.handleEvent = function( {
    api, event
}) {
    if(!event.isGroup)return;
    const destF = destD + '/' + event.threadID + '.json';
    if (!existsSync(destF)) writeFileSync(destF, '{"user": []}');
    const dataF = JSON.parse(readFileSync(destF, 'utf-8')),
    allID = event.participantIDs;
    if (dataF.user.length != allID.length) {
        allID.forEach(i => {
            if (!dataF.user.find(j => j.id == i)) dataF.user.push(newUser(i));
        });
        dataF.user = dataF.user.filter(i => allID.includes(i.id));
    };
    writeFileSync(destF,
        JSON.stringify(dataF, 0, 0),
        'utf-8');
};
