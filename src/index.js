import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { getIndex, updateIndex } from './data.js'
import { translate } from './lib/translations/index.js'
import bot from './bot.js'

bot.command('start', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    ctx.reply("Добро пожаловать в Модерс Бота!\nОтправьте /help для получения помощи по боту.", { parse_mode: "HTML" })
})

bot.command('help', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    ctx.reply("<b>Команды:</b>\n/info [id] - информация о пользователе\nИсходный код: https://github.com/shaman2016scratch/moders-tg-bot", { parse_mode: "HTML" })
})

bot.command('info', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    const userId = ctx.message.text.replace("/info ", "")
    const user = data.users[userId.toString()]
    ctx.reply(`<b>Информация о пользователе</b>\nID: ${user.id}\nUsername: ${user.username}\nИмя: ${user.firstName}\nВ боте с ${new Date(user.joined)}\nРепутация: ${user.reputation}`, { parse_mode: "HTML" })
})

bot.hears('+', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    if (ctx.message.reply_to_message) {
        if (!Object.keys(data.users).includes(ctx.message.reply_to_message.from.id.toString())) {
            data.users[ctx.message.reply_to_message.from.id.toString()] = {
                id: ctx.message.reply_to_message.from.id,
                username: ctx.message.reply_to_message.from.username,
                firstName: ctx.message.reply_to_message.from.first_name,
                language: "en",
                joined: new Date(),
                reputation: 0
            }
            await updateIndex(data)
        }
        data.users[ctx.message.reply_to_message.from.id.toString()].reputation++
        await updateIndex(data)
        const sendUser = (ctx.message.from.username ? `@${ctx.message.from.username}` : `tg://user?id=${ctx.message.from.id}`)
        const targetUser = (ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `tg://user?id=${ctx.message.reply_to_message.from.id}`)
        ctx.reply(`${sendUser} увеличил репутацию ${targetUser}.\nНовая репутация: ${data.users[ctx.message.reply_to_message.from.id.toString()].reputation}`, { parse_mode: "HTML" })
    }
})

bot.hears('-', async (ctx) => {
    const data = await getIndex()
    if (!Object.keys(data.users).includes(ctx.message.from.id.toString())) {
        data.users[ctx.message.from.id.toString()] = {
            id: ctx.message.from.id,
            username: ctx.message.from.username,
            firstName: ctx.message.from.first_name,
            language: "en",
            joined: new Date(),
            reputation: 0
        }
        await updateIndex(data)
    }
    if (ctx.message.reply_to_message) {
        if (!Object.keys(data.users).includes(ctx.message.reply_to_message.from.id.toString())) {
            data.users[ctx.message.reply_to_message.from.id.toString()] = {
                id: ctx.message.reply_to_message.from.id,
                username: ctx.message.reply_to_message.from.username,
                firstName: ctx.message.reply_to_message.from.first_name,
                language: "en",
                joined: new Date(),
                reputation: 0
            }
            await updateIndex(data)
        }
        data.users[ctx.message.reply_to_message.from.id.toString()].reputation--
        await updateIndex(data)
        const sendUser = (ctx.message.from.username ? `@${ctx.message.from.username}` : `tg://user?id=${ctx.message.from.id}`)
        const targetUser = (ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `tg://user?id=${ctx.message.reply_to_message.from.id}`)
        ctx.reply(`${sendUser} уменьшил репутацию ${targetUser}.\nНовая репутация: ${data.users[ctx.message.reply_to_message.from.id.toString()].reputation}`, { parse_mode: "HTML" })
    }
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))