use std::error::Error;
use teloxide::{
    payloads::SendMessageSetters,
    prelude::*,
    types::{
        InlineKeyboardButton,
        InlineKeyboardMarkup,
        InlineQueryResultArticle,
        InputMessageContent,
        InputMessageContentText,
        Me,
    },
    utils::command::BotCommands,
};

/// These commands are supported:
#[derive(BotCommands)]
#[command(rename_rule = "lowercase")]
enum Command {
    Help,
    Start,
}
#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    pretty_env_logger::init();

    log::info!("Starting Bot...");

    let bot = Bot::from_env();

    let handler = dptree
        ::entry()
        .branch(Update::filter_message().endpoint(message_handler))
        .branch(Update::filter_callback_query().endpoint(callback_handler))
        .branch(Update::filter_inline_query().endpoint(inline_query_handler));

    Dispatcher::builder(bot, handler).enable_ctrlc_handler().build().dispatch().await;
    Ok(())
}

/// Creates a keyboard made by buttons in a big column.
fn make_keyboard() -> InlineKeyboardMarkup {
    let mut keyboard: Vec<Vec<InlineKeyboardButton>> = vec![];

    let trading_bot_menu = [
        "Buy Order",
        "Sell Order",
        "Active Orders",
        "Cancel Order",
        "Cancel All Orders",
        "Historical Orders",
        "Positions",
        "Balance",
    ];

    for versions in trading_bot_menu.chunks(3) {
        let row = versions
            .iter()
            .map(|&version| InlineKeyboardButton::callback(version.to_owned(), version.to_owned()))
            .collect();

        keyboard.push(row);
    }

    InlineKeyboardMarkup::new(keyboard)
}

async fn message_handler(
    bot: Bot,
    msg: Message,
    me: Me
) -> Result<(), Box<dyn Error + Send + Sync>> {
    if let Some(text) = msg.text() {
        match BotCommands::parse(text, me.username()) {
            Ok(Command::Help) => {
                // Just send the description of all commands.
                bot.send_message(msg.chat.id, Command::descriptions().to_string()).await?;
            }
            Ok(Command::Start) => {
                // Create a list of buttons and send them.
                let keyboard = make_keyboard();
                bot.send_message(msg.chat.id, "Trading Bot Menu:").reply_markup(keyboard).await?;
            }

            Err(_) => {
                bot.send_message(msg.chat.id, "Command not found!").await?;
            }
        }
    }

    Ok(())
}

async fn inline_query_handler(
    bot: Bot,
    q: InlineQuery
) -> Result<(), Box<dyn Error + Send + Sync>> {
    let menu = InlineQueryResultArticle::new(
        "0",
        "Trading Bot Menu",
        InputMessageContent::Text(
            InputMessageContentText::new("Trading Bot Menu
    Please Select an Option:")
        )
    ).reply_markup(make_keyboard());

    bot.answer_inline_query(q.id, vec![menu.into()]).await?;

    Ok(())
}

/// When it receives a callback from a button it edits the message with all
/// those buttons writing a text with the selected Debian version.
///
/// **IMPORTANT**: do not send privacy-sensitive data this way!!!
/// Anyone can read data stored in the callback button.
async fn callback_handler(bot: Bot, q: CallbackQuery) -> Result<(), Box<dyn Error + Send + Sync>> {
    if let Some(version) = q.data {
        let text = format!("You chose: {version}");

        // Tell telegram that we've seen this query, to remove 🕑 icons from the
        // clients. You could also use `answer_callback_query`'s optional
        // parameters to tweak what happens on the client side.
        bot.answer_callback_query(q.id).await?;

        // Edit text of the message to which the buttons were attached
        if let Some(Message { id, chat, .. }) = q.message {
            bot.edit_message_text(chat.id, id, text).await?;
        } else if let Some(id) = q.inline_message_id {
            bot.edit_message_text_inline(id, text).await?;
        }

        log::info!("You chose: {}", version);
    }

    Ok(())
}
