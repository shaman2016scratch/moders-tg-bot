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

export { getStartUserObject, getReplyStartUserObject }