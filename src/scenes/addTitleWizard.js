import { Scenes } from 'telegraf';
import fireBaseService from '../services/fireBaseService';

const fbservice = new fireBaseService()

const addTitleWizard = new Scenes.WizardScene (
    'ADD_TITLE_WIZARD_ID', // first argument is Scene_ID, same as for BaseScene
    (ctx) => {
      ctx.reply('Введите название тайтла:');
      ctx.wizard.state.contactData = {};
      return ctx.wizard.next();
    },
    (ctx) => {
      // validation example
      if (ctx.message.text.length < 2) {
        ctx.reply('Please enter name for real');
        return; 
      }
      ctx.wizard.state.contactData.nameTitle = ctx.message.text;
      ctx.reply('Введите дату когда вы последний раз смотрели этот тайтл. в формате 00.00.0000');
      return ctx.wizard.next();
    },
    async (ctx) => {
      ctx.wizard.state.contactData.dataTitle = ctx.message.text;
      await ctx.reply(`Название тайтла: ${ctx.wizard.state.contactData.nameTitle}, дата последнего просмотра: ${ctx.message.text}`)
      await ctx.reply('Все верно? (введите "Y" если все верно, "N" что бы сбросить создание тайтла')
      return ctx.wizard.next();
      
    },
     async (ctx) => {
        try {
          if(ctx.message.text === 'Y'){
            const newTitle = {
                name: ctx.wizard.state.contactData.nameTitle,
                time: ctx.wizard.state.contactData.dataTitle
            }
            ctx.wizard.state.contactData = null
            await fbservice.addTitle(newTitle)
            await ctx.reply(`Ваш тайтл добавлен.`)
            return ctx.scene.leave();}
        else{
            ctx.wizard.state.contactData = null
            await ctx.reply(`Ваш тайтл сброшен.`)
            return ctx.scene.leave();
        }
        } catch (error) {
          console.log(error)
        }
    }
);

export default addTitleWizard