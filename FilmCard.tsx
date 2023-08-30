import React, {useState} from 'react'
import FilmData from './FilmData'
import { languageMap } from './constArrays'

export default function FilmCard({data}: {data: FilmData}) {
    const [imageURL, setImageURL] = useState("")
    const [overview, setOverview] = useState("")

    // TODO: need to refactor so that this and
    // other instances of fetch functions are
    // instances of a more general function.
    
    // a function to get the film overview from the tmdb api <= 08/29/23 21:14:11 // 
    async function getOverview(imdb_id: string | undefined): Promise<void> {
	// TODO: Need to add state to cards to handle what's displayed when images are loading <= 08/28/23 19:19:53 // 
	
	// setDisplaystate({state: "text", text: "Loading..."}); 
	let formData = new FormData()
	
	if (imdb_id == undefined) return 

	// calling sanitizeFieldsForAPI <= 08/13/23 12:57:00 // 
	formData.append("request", JSON.stringify({action: "getoverview", content: imdb_id}))

	// calling fetch and storing the response <= 08/12/23 19:58:32 // 
	let resPromise = await fetch("/filmclub/api.php", {method: "POST", body: formData}); 

	let strResponse = await resPromise.text()
	console.log("server response: >" + strResponse + "<")

	try {
	    // return from the server should be json encoding an object with string properties 'status' and 'message' <= 08/26/23 10:29:35 // 
	    let resOb: {success: boolean, message: string} = JSON.parse(strResponse)
	    console.log("response object: " + resOb)
	    if (resOb.success) {
		setOverview(resOb.message)
	    } else {
		// TODO: do something here <= 08/28/23 19:55:43 // 
		return
	    }
	} catch (e) {
	    // response body didn't parse as JSON so we display the message received <= 08/15/23 10:16:08 // 
	    console.log("ERROR: " + e)
	    return
	}
    }

    // a function to get the card image <= 08/28/23 19:25:45 // 
    async function getImage(imdb_id: string | undefined): Promise<void> {
	// TODO: Need to add state to cards to handle what's displayed when images are loading <= 08/28/23 19:19:53 // 
	
	// setDisplaystate({state: "text", text: "Loading..."}); 
	let formData = new FormData()
	
	if (imdb_id == undefined) return 

	// calling sanitizeFieldsForAPI <= 08/13/23 12:57:00 // 
	formData.append("request", JSON.stringify({action: "getimage", content: imdb_id}))

	// calling fetch and storing the response <= 08/12/23 19:58:32 // 
	let resPromise = await fetch("/filmclub/api.php", {method: "POST", body: formData}); 

	let strResponse = await resPromise.text()
	console.log("server response: >" + strResponse + "<")

	try {
	    // return from the server should be json encoding an object with string properties 'status' and 'message' <= 08/26/23 10:29:35 // 
	    let resOb: {success: boolean, message: string} = JSON.parse(strResponse)
	    console.log("response object: " + resOb)
	    if (resOb.success) {
		setImageURL(resOb.message)
	    } else {
		// TODO: do something here <= 08/28/23 19:55:43 // 
		return
	    }
	} catch (e) {
	    // response body didn't parse as JSON so we display the message received <= 08/15/23 10:16:08 // 
	    console.log("ERROR: " + e)
	    return
	}
    }


    // swapping out abbreviations for full names of languages <= 08/28/23 17:02:45 // 
    function lmap(s: string | undefined) {
	let ret: string | undefined = "english"
	languageMap.forEach((x) => { if (x.at(0) === s) ret = x.at(1) })
	return ret
    }

    function titleCase(s: string | undefined): string {
	if (s !== undefined) {
	    return s.substring(0,1).toUpperCase() + s.substring(1)
	} else return "";
    }

    // make long numbers look nicer with commas <= 08/28/23 17:03:04 // 
    function commafy(numstring: string | undefined): string {
	if (numstring !== undefined) {
	    let replace = numstring?.replace(/(.*)(([^,])(\d\d\d))((,\d\d\d)*)$/, "$1$3,$4$5")
	    while (replace !== numstring) {
		numstring = replace
		replace = numstring?.replace(/(.*)(([^,])(\d\d\d))((,\d\d\d)*)$/, "$1$3,$4$5")
	    }
	    return numstring
	}
	return ""
    }

    function isImageUrl(url: string): boolean {
	return url.search(/((jpg)|(png))$/) > 0
    }

    getImage(data.imdb_id)
    getOverview(data.imdb_id)

    return <>
	<div className="col-sm">
	    <div className="card" style={{width: '18rem'}}>
		{ isImageUrl(imageURL) ? <img className="card-img-top" src={imageURL} alt={"Poster for " + titleCase(data.englishTitle)} /> : "" }
		<div className="card-body">
		    <h5 className="card-title cardTitle">{data.englishTitle}</h5>
		    { data.englishTitle?.replaceAll(":", "").toLowerCase !== data.originalTitle?.toLowerCase ? <p className="card-text">{data.originalTitle}</p> : "" }
		    <ul className="list-group list-group-flush cardList">
			<li className="list-group-item cardText">
			    <span className="cardDataTitle">Year</span><span className="normal">:</span> {data.year}</li>
			<li className="list-group-item cardText">
			    <span className="cardDataTitle">Length (min)</span><span className="normal">:</span> {data.length}</li>
			<li className="list-group-item cardText">
			    <span className="cardDataTitle">IMDb Rating</span><span className="normal">:</span> {data.rating} ({commafy(data.numratings?.toString())})</li>
			<li className="list-group-item cardText">
			    <span className="cardDataTitle">Acclaim</span><span className="normal">:</span> {data.acclaim}</li>
			{ overview !== "" ?
			    <li className="list-group-item cardText synopsis">
				<span className="cardDataTitle">Synopsis</span><span className="normal">:</span> {overview}</li> : "" }
			{ !data.directors?.startsWith("Na") && !data.directors?.startsWith("N/a") ?  
			    <li className="list-group-item cardText">
				<span className="cardDataTitle">Director(s)</span><span className="normal">:</span> {data.directors?.replaceAll(',', ", ")}</li> : "" }
			{ !data.actors?.startsWith("Na") && !data.actors?.startsWith("N/a") ?  
			    <li className="list-group-item cardText">
				<span className="cardDataTitle">Actor(s)</span><span className="normal">:</span> {data.actors?.replaceAll(',', ", ")}</li> : "" }
			{ !data.writers?.startsWith("Na") && !data.writers?.startsWith("N/a") ?  
			    <li className="list-group-item cardText">
				<span className="cardDataTitle">Writer(s)</span><span className="normal">:</span> {data.writers?.replaceAll(',', ", ")}</li> : "" }
			{ lmap(data.language) !== "english" && lmap(data.language) !== undefined ?  
			    <li className="list-group-item cardText">
				<span className="cardDataTitle">Language</span><span className="normal">:</span> {titleCase(lmap(data.language))}</li> : "" }
			<li className="list-group-item">
			    <a href={`https://www.imdb.com/title/${data.imdb_id}`} target="_blank" className="btn btn-primary linkButton">IMDb</a>
			    <div className="btn btn-primary linkButton">MyList+</div>
			</li>
		    </ul>
		</div>
	    </div>
	</div>
    </>
} 

