// This is meant to encapsulate all the interactions with personal lists <= 08/28/23 09:23:05 // 
import React from 'react'
import FilmData from './FilmData'

export default class MyListHandle {
    private myListState: [] = []
    private setMyListState: React.Dispatch<React.SetStateAction<string>> 
    private username: string
    constructor(myListStateJSON: string, setMyListState: React.Dispatch<React.SetStateAction<string>>, username: string) {
	this.myListState = JSON.parse(myListStateJSON)
	if (this.myListState == undefined) this.myListState = []
	this.setMyListState = setMyListState
	this.username = username
    }

    addToMyList(filmdata: FilmData) {}
    removeFromMyList(filmdata: FilmData) {}
    async getMyList() {
	let formData = new FormData()

	formData.append("mylist", JSON.stringify({username: this.username, action: "get"}))

	// calling fetch and storing the response <= 08/12/23 19:58:32 // 
	let resPromise = await fetch("/filmclub/api.php", {method: "POST", body: formData}); 

	let strResponse = await resPromise.text()
	console.log("server response: >" + strResponse + "<")

	try {
	    this.setMyListState(strResponse)
	}
	catch (e) {
	    // response body didn't parse as JSON so we display the message received <= 08/15/23 10:16:08 // 
	    console.log(e)
	    this.setMyListState("error!")
	}

    }
}
