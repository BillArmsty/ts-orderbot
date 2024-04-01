import 'dotenv/config'

export const CONFIG = {
    BYBIT_API_KEY: process.env.BYBIT_API_KEY || '',
    BYBIT_API_SECRET: process.env.BYBIT_API_SECRET || '',
    BYBIT_TESTNET:  'true',
    MAIN_URL: process.env.MAIN_URL || '',
    BOT_TOKEN: process.env.BOT_TOKEN!,
    WHITELISTED_USERS: process.env.WHITELISTED_USERS || '',
    BINANCE_API_KEY: process.env.BINANCE_API_KEY || '',
    BINANCE_API_SECRET: process.env.BINANCE_API_SECRET || '',
    BINANCE_TESTNET: 'true',
    useTestnet: 'true',
}

export const dbConfig = {
    HOST: process.env.DB_HOST || '',
    USER: process.env.DB_USER || '',
    PASSWORD: process.env.DB_PASSWORD || '',
    DB: process.env.DB_NAME || '',
}