import React from 'react'
import FilmData from './FilmData'
import { languageMap } from './constArrays'

export default function FilmCard({data}: {data: FilmData}) {
    function lmap(s: string | undefined) {
	let ret: string | undefined = "english"
	languageMap.forEach((x) => { if (x.at(0) === s) ret = x.at(1) })
	return ret
    }

    function titleCase(s: string): string {
	return s.substring(0,1).toUpperCase() + s.substring(1)
    }

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

    return <>
	<div className="col-sm">
	    <div className="card">
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
		    <li className="list-group-item"><a href={`https://www.imdb.com/title/${data.imdb_id}`} target="_blank" className="btn btn-primary">IMDb</a>
		    </li>
		    </ul>
		</div>
	    </div>
	</div>
    </>
} 
// <div class="container text-center">
//   <div class="row">
//     <div class="col-sm-8">col-sm-8</div>
//     <div class="col-sm-4">col-sm-4</div>
//   </div>
//   <div class="row">
//     <div class="col-sm">col-sm</div>
//     <div class="col-sm">col-sm</div>
//     <div class="col-sm">col-sm</div>
//   </div>
// </div>

