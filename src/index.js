import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { getIndex, updateIndex } from './data.js'
import { translate } from './lib/translations/index.js'
import { ModersString, ModersArray } from './types.js'
import { getStartUserObject, getReplyStartUserObject, getStartChatObject } from './templaces.js'
import { MaxMin, formatDate, random } from './utils.js'
import bot from './bot.js'
import DashAttach from 'dashattach'
import dotenv from 'dotenv'

dotenv.config()

const { CHAT8787_ID, MODERS_CHAT_ID, MODERS_LOGS_CHAT } = process.env

const emoji = {
    views: "👁️‍🗨️",
    forks: "🌀",
    fires: "🔥",
    followers: "👥",
    following: "👥",
    admin: "🛡️",
    king: "👑",
    dollar: "💲"
}

const log = (text, parse_mode) => {
    bot.telegram.sendMessage(MODERS_LOGS_CHAT, text, { parse_mode: parse_mode ? parse_mode : "HTML" })
}

const logPro = (text, parse_mode) => {
    bot.telegram.sendMessage(6049462351, text, { parse_mode: parse_mode ? parse_mode : "HTML" })
}

bot.telegram.sendMessage(CHAT8787_ID, "Бот запущен", { parse_mode: "HTML" })
bot.telegram.sendMessage(MODERS_CHAT_ID, "Бот запущен", { parse_mode: "HTML" })
log("Бот запущен")

bot.command('start', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    await ctx.reply(`Добро пожаловать в Модерс Бота!
Отправьте /help для получения помощи по боту.
    `, { parse_mode: "HTML" })
    if (ctx.message.text.split(" ")[1]) if (ctx.message.text.split(" ")[1].split("=")[0] === "ref") {
        if (!data.users[ctx.message.from.id.toString()].ref) {
            const refer = ctx.message.text.split(" ")[1].split("=")[1]
            if (Object.keys(data.referal_system).includes(refer)) {
                data.users[ctx.message.from.id.toString()].ref = refer
                data.referal_system[refer].activates.push({ author: ctx.message.from.id, at: new Date() })
                await updateIndex(data)
            } else {
                ctx.reply("Рефералки нету")
            }
        } else {
            ctx.reply("Ты уже подключен")
        }
    }
})

bot.command('help', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    ctx.reply(`<b>Команды:</b>
/info [id] - информация о выбранном пользователе
/me - ваша информация
/ban [user] - заблокировать пользователя
/unban [user] - разблокировать пользователя
/mute [user] - запретить пользователю писать
/unmute [user] - разрешить пользователю писать
/setpermission [user] [permission] [value (true/false строчными)] - изменить права пользователя
/dashproject [id] - получить проект на <a href="https://dashblocks.org">Dash</a>
/dashuser [id/username] - получить пользователя на <a href="https://dashblocks.org">Dash</a>
/top [size] - топ пользователей по репутации
/ref - реферальная система
/chattop [size] - топ пользователей чата по репутации
/chat [id] - информация о чате
/thischat - информация о этом чате
/dashstudio [id] - информация о студии на <a href="https://dashblocks.org">Dash</a>
/time [type] [timecode] - время

Версия DashAttach: ${DashAttach.library.version}
Исходный код: https://github.com/shaman2016scratch/moders-tg-bot
    `, { parse_mode: "HTML" })
})

bot.command('info', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const userId = ctx.message.text.replace("/info ", "")
    const user = data.users[userId.toString()]
    if (user) {
        ctx.reply(`<b>Информация о пользователе</b>
ID: ${user.id || 0}
Username: ${user.username}
Имя: ${user.firstName}
В боте с ${formatDate(user.joined)}
Репутация: ${user.reputation}
        `, { parse_mode: "HTML" })
    } else {
        ctx.reply(`Пользователя не существует`)
    }
})

bot.hears('+', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    if (ctx.message.reply_to_message) {
        if (!Object.keys(data.users).includes(ctx.message.reply_to_message.from.id.toString())) {
            data.users[ctx.message.reply_to_message.from.id.toString()] = getReplyStartUserObject(ctx)
            await updateIndex(data)
        }
        if (ctx.message.reply_to_message.from.id !== ctx.message.from.id || data.admins.includes(ctx.message.from.id)) {
            data.users[ctx.message.reply_to_message.from.id.toString()].reputation++
            await updateIndex(data)
            const sendUser = (ctx.message.from.username ? `@${ctx.message.from.username}` : `tg://user?id=${ctx.message.from.id}`)
            const targetUser = (ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `tg://user?id=${ctx.message.reply_to_message.from.id}`)
            ctx.reply(`${sendUser} увеличил репутацию ${targetUser}.\nНовая репутация: ${data.users[ctx.message.reply_to_message.from.id.toString()].reputation}`, { parse_mode: "HTML" })
        } else {
            ctx.reply("Жулик, так не честно!")
        }
    }
})

bot.hears('-', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    if (ctx.message.reply_to_message) {
        if (!Object.keys(data.users).includes(ctx.message.reply_to_message.from.id.toString())) {
            data.users[ctx.message.reply_to_message.from.id.toString()] = getReplyStartUserObject(ctx)
            await updateIndex(data)
        }
        data.users[ctx.message.reply_to_message.from.id.toString()].reputation--
        await updateIndex(data)
        const sendUser = (ctx.message.from.username ? `@${ctx.message.from.username}` : `tg://user?id=${ctx.message.from.id}`)
        const targetUser = (ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `tg://user?id=${ctx.message.reply_to_message.from.id}`)
        ctx.reply(`${sendUser} уменьшил репутацию ${targetUser}.\nНовая репутация: ${data.users[ctx.message.reply_to_message.from.id.toString()].reputation}`, { parse_mode: "HTML" })
    }
})

bot.command('me', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const userId = ctx.message.from.id
    const user = data.users[userId.toString()]
    ctx.reply(`<b>Информация о пользователе</b>
ID: ${user.id || 0}
Username: ${user.username}
Имя: ${user.firstName}
В боте с ${formatDate(user.joined)}
Репутация: ${user.reputation}
    `, { parse_mode: "HTML" })
})

bot.command('addbotadmin', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    if (data.admins.includes(ctx.message.from.id)) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.replace("/info ", "")
        data.admins.push(userId)
        await updateIndex(data)
    }
})

bot.command('setreputation', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    if (data.admins.includes(ctx.message.from.id)) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.split(" ")[1]
        const rep = ctx.message.reply_to_message ? Number(ctx.message.text.split(" ")[1]) : Number(ctx.message.text.split(" ")[2])
        data.users[userId.toString()].reputation = rep
        await updateIndex(data)
    }
})

bot.command('ban', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const admins = await ctx.getChatAdministrators()
    if (data.admins.includes(ctx.message.from.id) || admins) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.split(" ")[1]
        const time = ctx.message.reply_to_message ? Number(ctx.message.text.split(" ")[1]) : Number(ctx.message.text.split(" ")[2])
        try {
            await ctx.banChatMember(userId, time)
            ctx.reply(`Пользователь ${userId} забанен!`)
        } catch (e) {
            ctx.reply(`Error with ban chat member: ${e.message}`)
            console.error(e)
        }
    }
})

bot.command('unban', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const admins = await ctx.getChatAdministrators()
    if (data.admins.includes(ctx.message.from.id) || admins) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.split(" ")[1]
        try {
            await ctx.unbanChatMember(userId)
            ctx.reply(`Пользователь ${userId} разбанен!`)
        } catch (e) {
            ctx.reply(`Error with unban chat member: ${e.message}`)
            console.error(e)
        }
    }
})

bot.command('mute', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const admins = await ctx.getChatAdministrators()
    if (data.admins.includes(ctx.message.from.id) || admins) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.split(" ")[1]
        try {
            await ctx.restrictChatMember(userId, { permissions: { can_send_messages: false } })
            ctx.reply(`Пользователь ${userId} замучен!`)
        } catch (e) {
            ctx.reply(`Error with mute chat member: ${e.message}`)
            console.error(e)
        }
    }
})

bot.command('unmute', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const admins = await ctx.getChatAdministrators()
    if (data.admins.includes(ctx.message.from.id) || admins) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.split(" ")[1]
        try {
            await ctx.restrictChatMember(userId, { permissions: { can_send_messages: true } })
            ctx.reply(`Пользователь ${userId} размучен!`)
        } catch (e) {
            ctx.reply(`Error with unmute chat member: ${e.message}`)
            console.error(e)
        }
    }
})

bot.command('setpermission', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    let permissions = {}
    const admins = await ctx.getChatAdministrators()
    if (data.admins.includes(ctx.message.from.id) || admins) {
        const userId = ctx.message.reply_to_message ? ctx.message.reply_to_message.from.id : ctx.message.text.split(" ")[1]
        const permission = ctx.message.reply_to_message ? ctx.message.text.split(" ")[1] : ctx.message.text.split(" ")[2]
        const val = ctx.message.reply_to_message ? ctx.message.text.split(" ")[2] : ctx.message.text.split(" ")[3]
        permissions[permission] = Boolean(val)
        try {
            await ctx.restrictChatMember(userId, { permissions })
            ctx.reply(`Успех при смене прав ${userId}!`)
        } catch (e) {
            ctx.reply(`Error with set permissions user chat member: ${e.message}`)
            console.error(e)
        }
    }
})

bot.command('dashproject', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const projectId = ctx.message.text.split(" ")[1]
    try {
        const info = {
            author: await DashAttach.info.projects.getAuthorUsername(projectId),
            forks: await DashAttach.info.projects.stats.forks(projectId),
            views: await DashAttach.info.projects.stats.views(projectId),
            fires: await DashAttach.info.projects.stats.fires(projectId),
            description: await DashAttach.info.projects.getDescription(projectId),
            name: await DashAttach.info.projects.getName(projectId),
            url: await DashAttach.info.projects.getFileURL(projectId)
        }
        ctx.reply(`<b>Проект <a href="https://dashblocks.org/#${projectId}">${info.name}</a></b>
${emoji.views}${info.views} ${emoji.forks}${info.forks} ${info.fires}${emoji.fires}

<b>Автор: </b><a href="https://dashblocks.org/user#${info.author}">${info.author}</a>
<b>Описание: </b>${info.description.replaceAll(/@([\w-]+)/g, (match, group) => `<a href='https://dashblocks.org/user#${group.replace(/\s/g, '')}'>${match.replace("@", "u")}</a>`)}

Скачать: ${info.url}
        `, { parse_mode: "HTML" })
    } catch (e) {
        ctx.reply(`Error with get dash project info: ${e.message}`)
        console.error(e)
    }
})

bot.command('dashuser', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const userId = ctx.message.text.split(" ")[1]
    try {
        const info = {
            username: await DashAttach.info.users.getUsername(await DashAttach.info.users.getId(userId)),
            id: await DashAttach.info.users.getId(userId),
            role: await DashAttach.info.users.getRole(userId),
            description: await DashAttach.info.users.getDescription(userId),
            featured: {
                id: (await DashAttach.info.users.getRecommendedProject(userId)).id,
                name: await DashAttach.info.projects.getName((await DashAttach.info.users.getRecommendedProject(userId)).id)
            },
            followers: await DashAttach.info.users.stats.followers(userId),
            following: await DashAttach.info.users.stats.following(userId)
        }
        const formatRole = (info.role === "dasher") ? "Дэшер" : (
            (info.role === "dashteam") ? `${emoji.admin}Команда Dash${emoji.king}` : (
                (info.role === "dasher+") ? "Дэшер+" : (
                    (info.role === "dash-supporter") ? `Подписчик Dash${emoji.dollar}` : info.role
                )
            ))
        ctx.reply(`
<b>Пользователь <a href="https://dashblocks.org/user#${info.id}">${info.username}</a></b> <b>${formatRole}</b>
${emoji.followers}${info.followers} подписчиков, ${emoji.following} подписана на ${info.following}

<b>Описание: </b>${info.description.replaceAll(/@([\w-]+)/g, (match, group) => `<a href='https://dashblocks.org/user#${group.replace(/\s/g, '')}'>${match.replace("@", "u")}</a>`)}
<b>Рекомендуемый проект</b>: <a href="https://dashblocks.org/#${info.featured.id}">${info.featured.name}</a>
        `, { parse_mode: "HTML" })
    } catch (e) {
        ctx.reply(`Error with get dash user info: ${e.message}`)
        console.error(e)
    }
})

bot.command('top', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const count123 = MaxMin(ctx.message.text.split(" ")[1] || 5, 10, 3)
    const userArray = new ModersArray(Object.values(data.users))
    const sortedUsers = userArray.sortTop()
    const mapTop = sortedUsers.map((element, index) => { return `${index+1}. <a href="https://t.me/${element.username}">${element.username}</a> (${element.reputation})` })
    const topWithCount = mapTop.slice(0, count123)
    ctx.reply(`<b>Топ пользователей по репутации:</b>
${topWithCount.join("\n")}
    `, { parse_mode: "HTML" })
})

bot.command('ref', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    if (!Object.keys(data.referal_system).includes(ctx.message.from.id.toString())) {
        data.referal_system[ctx.message.from.id.toString()] = {
            activates: [],
            author: ctx.message.from.id,
            created: new Date(),
            last_used: new Date()
        }
        await updateIndex(data)
    }
    const botInfo = await bot.telegram.getMe()
    const botUsername = botInfo.username
    await ctx.reply(`Реферальная система
Количество реферальщиков: ${data.referal_system[ctx.message.from.id.toString()].activates.length}

Твоя ссылка: https://t.me/${botUsername}?start=ref=${ctx.message.from.id}
    `, { parse_mode: "HTML" })
})

bot.command('users', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const userArray = Object.values(data.users)
    const sortedUsers = userArray.toSorted((a, b) => b.reputation - a.reputation)
    const mapTop = sortedUsers.map((element) => { return `<a href="https://t.me/${element.username}">${element.username}</a> (${element.reputation})` })
    if (data.admins.includes(ctx.message.from.id)) ctx.reply(`<b>Пользователи:</b>
1. ${mapTop[0]}
2. ${mapTop[1]}
3. ${mapTop[2]}
4. ${mapTop[3]}
5. ${mapTop[4]}
6. ${mapTop[5]}
7. ${mapTop[6]}
8. ${mapTop[7]}
9. ${mapTop[8]}
10. ${mapTop[9]}
11. ${mapTop[10]}
12. ${mapTop[11]}
13. ${mapTop[12]}
14. ${mapTop[13]}
15. ${mapTop[14]}
16. ${mapTop[15]}
17. ${mapTop[16]}
18. ${mapTop[17]}
19. ${mapTop[18]}
    `, { parse_mode: "HTML" })
})

bot.command('send', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    if (data.trusted_users.includes(ctx.message.from.id)) {
        try {
            const mess = new ModersString(ctx.message.text.replace("/send", "")).replaceDate()
            ctx.reply(mess, { parse_mode: "HTML" })
        } catch (e) {
            console.error(`USER_ID:${ctx.message.from.id} COMMAND:/SEND ERROR:`)
            console.log(e)
            await log(`USER_ID:${ctx.message.from.id} COMMAND:/SEND ERROR: ${e.message}`)
            await logPro(`USER_ID:${ctx.message.from.id} COMMAND:/SEND ERROR: ${e.message}`)
            ctx.reply(`Error with sending message: ${e.message}.`)
        }
    } else {
        ctx.reply("Тебе не нельзя")
    }
})

bot.command('chattop', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const count123 = MaxMin(ctx.message.text.split(" ")[1] || 5, 10, 3)
    const botUsers = data.users
    const groupUsers = data.chats[ctx.message.chat.id.toString()].members
    const userArray = new ModersArray(groupUsers.map((userId) => { return botUsers[userId] }))
    const sortedUsers = userArray.sortTop()
    const mapTop = sortedUsers.map((element, index) => { return `${index+1}. <a href="https://t.me/${element.username}">${element.username}</a> (${element.reputation})` })
    const topWithCount = mapTop.slice(0, count123)
    ctx.reply(`<b>Топ пользователей чата ${data.chats[ctx.message.chat.id.toString()].firstName} по репутации:</b>
${topWithCount.join("\n")}
    `, { parse_mode: "HTML" })
})

bot.command('chat', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const chatId = ctx.message.text.replace("/chat ", "")
    const chat = data.chats[chatId.toString()]
    if (chat) {
        ctx.reply(`<b>Информация о чате</b>
ID: ${chat.id || 0}
Username: ${chat.username}
Имя: ${chat.firstName}
В боте с ${formatDate(chat.inBotAt, 0)}
Рейтинг: ${chat.rating}
        `, { parse_mode: "HTML" })
    } else {
        ctx.reply(`Чата не существует`)
    }
})

bot.command('thischat', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    ctx.reply(`<b>Информация о этом чате</b>
ID: ${ctx.message.chat.id}
    `, { parse_mode: "HTML" })
})

bot.command('dashstudio', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const studioId = ctx.message.text.split(" ")[1]
    try {
        const info = {
            name: await DashAttach.info.studios.getName(studioId),
            description: await DashAttach.info.studios.getDescription(studioId),
            createdAt: new Date(await DashAttach.info.studios.createdAt(studioId)),
            updatedAt: new Date(await DashAttach.info.studios.updatedAt(studioId)),
            owner: await DashAttach.info.studios.getOwner(studioId)
        }
        ctx.reply(`
<b>Студия <a href="https://dashblocks.org/studio#${studioId}">${info.name}</a></b>

<b>Описание: </b>${info.description.replaceAll(/@([\w-]+)/g, (match, group) => `<a href='https://dashblocks.org/user#${group.replace(/\s/g, '')}'>${match.replace("@", "u")}</a>`)}
<b>Автор:</b> <a href="https://dashblocks.org/user#${info.owner.id}">${info.owner.username}</a>
<b>Создана: </b>${formatDate(info.createdAt, 0)}
<b>Обновлена: </b>${formatDate(info.updatedAt, 0)}
        `, { parse_mode: "HTML" })
    } catch (e) {
        ctx.reply(`Error with get dash studio info: ${e.message}`)
        console.error(e)
    }
})

bot.command('time', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const type = Number(ctx.message.text.split(" ")[1])
    const timecode = Number(ctx.message.text.split(" ")[2])
    const now = new Date()
    ctx.reply(`<b>Время</b>
Текущее: ${formatDate(now, type)}
Указанное: ${formatDate(timecode, type)}
Текущий таймкод: ${now.getTime()}
Текстовый вариант текущего времени: ${now.toISOString()}
Дней с 1970-ого: ${now.getTime() / 1000 / 60 / 60 / 24}
        `, { parse_mode: "HTML" })
})

bot.command('random', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const min = Number(ctx.message.text.split(" ")[1] || 0)
    const max = Number(ctx.message.text.split(" ")[2] || 100)
    const rand = random(min, max)
    ctx.reply(`<b>Радномное значение</b>
От ${min} до ${max}
Всего вариантов: ${max-min+1}
Результат: ${rand}
        `, { parse_mode: "HTML" })
})

bot.command('game_random', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const min = 0
    const max = 9
    const rand = random(min, max)
    const rand2 = random(min, max)
    const rand3 = random(min, max)
    const rand4 = random(min, max)
    const joined = [rand,rand2,rand3,rand4].join("")
    const plus = (joined === "9999") ? 9*6 : (
        (joined === "8787") ? 87*3 : (
            (joined === "1234") ? 12+34+56 : (
                (joined === "0000" || joined === "1111" || joined === "2222") ? -60 : rand+rand2+rand3+rand4
            )
        )
    )
    if (!data.users[ctx.message.from.id.toString()].modersgamecoin) data.users[ctx.message.from.id.toString()].modersgamecoin = 0
    data.users[ctx.message.from.id.toString()].modersgamecoin += plus
    updateIndex(data)
    ctx.reply(`<b>Игра с рандомный значением.</b>
Предупреждение: ModersGameCoin внутриигровая валюта никак не связанная с реальностью.
Правила: Ваши ModersGameCoin увеличиваются на сумму выпаденных чисел. Но, комбинации 0000, 1111 и 2222 уменьшают ваши ModersGameCoin, а 9999, 1234 и 8787 - увеличивают нестандартным способом.
${rand}${rand2}${rand3}${rand4}
Вы получаете: ${plus} modersgamecoin
Теперь у вас: ${data.users[ctx.message.from.id.toString()].modersgamecoin}
До этого у вас было: ${data.users[ctx.message.from.id.toString()].modersgamecoin - plus}
        `, { parse_mode: "HTML" })
})

bot.command('game_top', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = getStartUserObject(ctx)
        await updateIndex(data)
    }
    if (!Object.keys(data.chats).includes(ctx.message.chat.id.toString())) {
        data.chats[ctx.message.chat.id.toString()] = getStartChatObject(ctx)
        await updateIndex(data)
    }
    if (!data.chats[ctx.message.chat.id.toString()].members.includes(ctx.message.from.id.toString())) {
        data.chats[ctx.message.chat.id.toString()].members.push(ctx.message.from.id.toString())
        await updateIndex(data)
    }
    const count123 = MaxMin(ctx.message.text.split(" ")[1] || 5, 10, 3)
    const userArray = new ModersArray(Object.values(data.users))
    const sortedUsers = userArray.sortTop2()
    const mapTop = sortedUsers.map((element, index) => { return `${index+1}. <a href="https://t.me/${element.username}">${element.username}</a> (${element.modersgamecoin})` })
    const topWithCount = mapTop.slice(0, count123)
    ctx.reply(`<b>Топ пользователей по ModersGameCoin:</b>
${topWithCount.join("\n")}
    `, { parse_mode: "HTML" })
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))