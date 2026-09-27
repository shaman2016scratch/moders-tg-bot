import { ModersObject } from "./types.js";

const getStartUserObject = (ctx) => {
    return {
        id: ctx.message.from.id,
        username: ctx.message.from.username,
        firstName: ctx.message.from.first_name,
        language: "en",
        joined: new Date(),
        reputation: 0
    }
}

const getReplyStartUserObject = (ctx) => {
    return {
        id: ctx.message.reply_to_message.from.id,
        username: ctx.message.reply_to_message.from.username,
        firstName: ctx.message.reply_to_message.from.first_name,
        language: "en",
        joined: new Date(),
        reputation: 0
    }
}

const getStartChatObject = (ctx) => {
    return {
        firstName: ctx.message.chat.first_name,
        username: ctx.message.chat.username,
        id: ctx.message.chat.id,
        type: ctx.message.chat.type,
        members: [
            ctx.message.from.id.toString()
        ],
        inBotAt: new Date()
    }
}

export { getStartUserObject, getReplyStartUserObject, getStartChatObject }