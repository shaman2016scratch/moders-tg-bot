import { Telegraf } from 'telegraf'
import { fileURLToPath } from 'url'
import path from 'path'
import dotenv from 'dotenv'
import { setDefaultResultOrder } from "node:dns";
setDefaultResultOrder("ipv6first")

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BOT_TOKEN = process.env.TG_BOT_TOKEN

const bot = new Telegraf(BOT_TOKEN)

export default bot