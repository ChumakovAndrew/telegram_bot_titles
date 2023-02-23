import { Scenes } from 'telegraf'
import fireBaseService from '../services/fireBaseService';

const fbservice = new fireBaseService()

  const delTitleWizard = new Scenes.WizardScene(
    'DEL_TITLE_WIZARD_ID', // first argument is Scene_ID, same as for BaseScene
    (ctx) => {
      ctx.reply('Введите название тайтла который хотите удалить:');
      return ctx.wizard.next();
    },
    async (ctx) => {
      try {
        const title = ctx.message.text;

        let delValidation = false
        let allTitles
      
        await fbservice.getAllTitles()
          .then(data => {
              const titles = fbservice.transformData(data)
  
              allTitles = [ ...titles ]
          })
  
        allTitles.forEach( async (item) => {
          const {titleName, titleId} = item
  
          if(titleName === title){    
            delValidation = true
            await fbservice.delTitle(titleId);
          }
        })
  
        delValidation
        ? ctx.reply('Тайтл удален') 
        : ctx.reply('Тайтл не был удален, так как его нет в базе данных')
  
      } catch (error) {
        console.error(error)
      }
      return ctx.scene.leave();
    },
  );

export default delTitleWizard