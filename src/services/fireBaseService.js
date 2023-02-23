import * as dotenv from 'dotenv'
import axios from "axios";

dotenv.config()

class fireBaseService {

     #apiKey = process.env.FB_SECRET_KEY
     #baseUrl = "https://test-project-d5726-default-rtdb.europe-west1.firebasedatabase.app/"

    getAllTitles = async () => { 
        
        const response = await axios.get(this.#baseUrl + 'titles.json?auth=' + this.#apiKey)

        return await response.data

    }


    delTitle = async (titleId) => {
       await axios.delete(this.#baseUrl + 'titles/' + titleId + '.json?auth=' + this.#apiKey)
    }

    addTitle = async (Title) => {
        await axios.post(this.#baseUrl + 'titles.json?auth=' + this.#apiKey, Title)
    }


    transformData = (data) => {
        const titles = []

        for(let key in data){

            const {name, time} = data[key]

            titles.push({
                titleId: key,
                titleName: name,
                titleTime: time
            })
        } 
        return titles
    }
}

export default fireBaseService






