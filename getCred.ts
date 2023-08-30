import React from 'react'
export type Cred = {
    login: boolean;
    username: string;
};

export default async function getcred(callback: (ls: Cred) => void): Promise<boolean> {
    /* @param {Function} callback - the {login: boolean, username: string} result of 
     * querying the api gets passed to this callback. 
     *
     * @returns {Promise<boolean>} Returns a promise that resolves to true on success.
     * */
    
    let formData = new FormData()
    formData.append("request", JSON.stringify({action: "getcred", content: ""}))
    var result = {login: false, username: ""}

    try {
	let resPromise = await fetch("/filmclub/api.php", {method: "POST", body: formData}); 
	let text = await resPromise.text()
	console.log("getcred response: >" + text + "<")
	result = JSON.parse(text)
    } catch (e) {
	console.log("ERROR FETCHING CREDENTIALS AND/OR DECODING" + e)
	return false
    }

    console.log("after json decode: >" + result + "<")

    try {
	callback(result)
	return true;
    } catch (e) {
	console.log("ERROR PROCESSING CREDENTIALS: " + e)
	return false;
    }
}
