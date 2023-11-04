import * as serverVariables from "../serverVariables.js";
import * as utilities from "../utilities.js";
import { log } from "../log.js";
let cachedUrlExpirationTime = serverVariables.get("main.url.CachedUrlExpirationTime");

globalThis.CachedUrls = [];

export default class CachedRequestsManager{
    static add(url,content,Etag=""){
        //Afficher ajout url dans caches
        globalThis.CachedUrls.push({url,content,Etag,Expire_Time:utilities.nowInSeconds()+ cachedUrlExpirationTime});
        log(FgGreen, "Adding url to cache.")
        return false;
    }
    static find(url){
        //Afficher extract  url dans cache
        log(FgYellow, "Searching url from cache...");
        return CachedUrls.find((obj)=>obj.url === url);
    }
    static clear(url){
        // Message courriel de Nicolas Chourot: Astuces - Labo 4
        let indexToDelete = [];
        for(let index = 0; index < CachedUrls.length; index++){
            const cachedItem = CachedUrls[index];
            if(cachedItem.url.toLowerCase().indexOf(url.toLowerCase()) > -1){
                indexToDelete.push(index);
                console.log("Cleared url " + cachedItem.url);
            }

        }
        log(FgRed,`Deleting all urls containing: ${url}`);
        utilities.deleteByIndex(CachedUrls,indexToDelete);
    }
    static flushExpired(){
        //Afficher retrait expired
        log(FgMagenta, "Flushing expiring caches...");
        let indexToDelete = [];
        let index = 0;
        let now = utilities.nowInSeconds();
        for (let cache of CachedUrls) {
            if (cache.Expire_Time < now) {
                console.log("Cached request data of " + cache.url + " expired");
                indexToDelete.push(index);
            }
            index++;
        }
        utilities.deleteByIndex(CachedUrls, indexToDelete);
    }
    static get(HttpContext){
        let cached = CachedRequestsManager.find(HttpContext.req.url);
        if(cached == undefined){
            log(FgRed, "Url from cache not found...");
            return false;
        }
        log(FgGreen, "Url from cache found...");
        return HttpContext.response.JSON(cached.content, cached.Etag, true);
    }
}

setInterval(CachedRequestsManager.flushExpired, cachedUrlExpirationTime * 1000);
log(BgWhite, FgBlack, "Periodic cached urls caches cleaning process started...");

// This is to test the clear method
// setInterval(()=>{
//     CachedRequestsManager.clear("api/words");
// },10000);