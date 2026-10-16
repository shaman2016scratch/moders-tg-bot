import { ModersObject } from "./types.js";

const getStartUserObject = (ctx) => {
    return {
        id: ctx.message.from.id,
        username: ctx.message.from.username,
        firstName: ctx.message.from.first_name,
        language: "en",
        joined: new Date(),
        reputation: 0,
        modersgamecoins: 0
    }
}

const getReplyStartUserObject = (ctx) => {
    return {
        id: ctx.message.reply_to_message.from.id,
        username: ctx.message.reply_to_message.from.username,
        firstName: ctx.message.reply_to_message.from.first_name,
        language: "en",
        joined: new Date(),
        reputation: 0,
        modersgamecoins: 0
    }
}

const getStartChatObject = (ctx) => {
    return {
        firstName: ctx.message.chat.first_name || ctx.message.chat.title,
        username: ctx.message.chat.username || "unknown",
        id: ctx.message.chat.id,
        type: ctx.message.chat.type,
        members: [
            ctx.message.from.id.toString()
        ],
        inBotAt: new Date(),
        rating: 0
    }
}

const getUserObject = (obj) => {
    return {
        id: obj.id,
        username: obj.username || "unknown",
        firstName: obj.firstName || "unknown",
        language: obj.language || "en",
        joined: new Date(obj.joined || Date.UTC(2026, 8, 6, 19, 23)),
        reputation: obj.reputation || 0,
        modersgamecoins: obj.modersgamecoins || 0,
        ref: obj.ref || undefined
    }
}

export { getStartUserObject, getReplyStartUserObject, getStartChatObject, getUserObject }
