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

export { getStartUserObject }