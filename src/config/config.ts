import 'dotenv/config'

export const CONFIG = {
    BYBIT_API_KEY: process.env.BYBIT_API_KEY || '',
    BYBIT_API_SECRET: process.env.BYBIT_API_SECRET || '',
    BYBIT_TESTNET:  'true',
    MAIN_URL: process.env.MAIN_URL || '',
    BOT_TOKEN: process.env.BOT_TOKEN || '',
}