import * as dotenv from 'dotenv'
import { Telegraf, Scenes} from 'telegraf';
import session from '@telegraf/session'

import allScenes from './scenes';
import fireBaseService from './services/fireBaseService';

dotenv.config()

const bot = new Telegraf(process.env.BOT_ID);

const fbservice = new fireBaseService()
const stage = new Scenes.Stage(allScenes);


bot.use(session())
bot.use(stage.middleware());

bot.start((ctx) => ctx.reply("hi bro)"));

bot.command('add', (ctx) => ctx.scene.enter('ADD_TITLE_WIZARD_ID'))
bot.command('all', async (ctx) => {
    let allTitles

    await fbservice.getAllTitles()
        .then(data => {
            const titles = fbservice.transformData(data)

            allTitles = [ ...titles ]
        })

    if(allTitles.length == 0) {
        ctx.reply(`На данный момент база данных пуста.`)
    }
    else {
        allTitles.forEach(element => {
            const { titleName, titleTime } = element
            ctx.reply(`${titleName} - ${titleTime}`)
        })
    
        allTitles = null
    }
})
bot.command('del', (ctx) => ctx.scene.enter('DEL_TITLE_WIZARD_ID'))
bot.command('mem', (ctx) => {console.log(ctx.message.from)} )

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));