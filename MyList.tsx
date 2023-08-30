// TODO: Add criterion collection data
// TODO: Add images
import DropdownInputField from './Dropdown'
import DoubleDropdownInputField from './DoubleDropdown'
import FilmCard from './FilmCard'
import { useState } from 'react'
import React from 'react'
import { languages, genres, dropdowns, fieldTypes, doubleDropdowns } from './constArrays'
import FilmData from './FilmData'
import TextInputField from './TextInputField'
import FieldAdder from './FieldAdder'
import getcred from './getCred'
import MyListHandle from './MyListHandle'

export default function MyList() {

    // state <= 08/11/23 16:08:18 // 
    const [formstate, setFormstate] = useState({count: 0, availableFieldtypes: fieldTypes, genrecount: 0, fields: [{id: 0, fieldtype: "", value: ""}]})
    const [displaystate, setDisplaystate] = useState({state: "init", filmdata: [[""]], text: ""})


    // TODO: replace this with a function that does the same thing in the client <= 08/28/23 11:29:14 // 
    async function submitForm() {
	setDisplaystate({state: "text", filmdata: displaystate.filmdata, text: "Loading..."}); 
	let formData = new FormData()

	// calling sanitizeFieldsForAPI <= 08/13/23 12:57:00 // 
	formData.append("mylist", JSON.stringify(wrapAction("get", sanitizeFieldsForAPI(formstate.fields))))

	// calling fetch and storing the response <= 08/12/23 19:58:32 // 
	let resPromise = await fetch("/filmclub/api.php", {method: "POST", body: formData}); 

	let strResponse = await resPromise.text()
	console.log("server response: >" + strResponse + "<")

	try {
	    let resOb = JSON.parse(strResponse)
	    setDisplaystate({state: "display", filmdata: resOb, text: ""})
	}
	catch (e) {
	    // response body didn't parse as JSON so we display the message received <= 08/15/23 10:16:08 // 
	    console.log(e)
	    setDisplaystate({state: "text", filmdata: displaystate.filmdata, text: strResponse})
	}
    }

    type MyListRequest = {
	action: string,
	items: { fieldtype: string, value: string }[]
    }

    function wrapAction(action: string, fields: {fieldtype: string, value: string}[]): MyListRequest  {
	return {action: action, items: fields}
    }

    // this will help ensure that the fields sent as json have the structure {fieldtype: blabla, value: blabla} <= 08/28/23 12:04:55 // 
    function sanitizeFieldsForAPI(fields: {id: number, fieldtype: string, value: string}[]) {
	console.log(fields)
	return fields
	    .filter((x) => x.value.search(/^(x\|)*$/) < 0 && x.value.search(/^0\-Infinity$/) < 0 && x.value !== "")
	.map((x) => { let ft = ""; let ftarray = x.fieldtype.match(/^[^ ]*/); if (ftarray !== null) ft = ftarray[0]; 
		return {fieldtype: ft.toLowerCase(), value: x.value.substring(0, Math.min(x.value.length, 400))}})
	    .filter((x) => x.fieldtype !== "")
    }

    function makeFilmCardsCols(json: string[][]) {
	let ret = []
	for (let i=0; i<json.length; i++) {
	    let data = new FilmData(json[i])
	    ret.push(<FilmCard data={data} />)
	}
	return ret
    }

    function makeFilmCards(json: string[][]) {
	return (
	    <div className="container text-center">
		<div className="row gy-5">
		    { makeFilmCardsCols(json) }
		</div>
	    </div>
	)
    }

    function fillCount(start: number, end: number, increment: number = 1): number[] {
	let ret = []
	for (let x = start; x < end; x += increment) { let y = Math.round(x*10)/10; if (y<end) ret.push(y) }
	return ret
    }

    function mapDropdowns(fieldtype: string): string[] {
	switch (fieldtype) {
	    case 'genre': return genres; 
	    case 'result size': return fillCount(1, 51).map((x) => x.toString())
	    case 'language': return languages;
	    default: return ["error"] 
	}
    }

    function mapDoubleDropdowns(fieldtype: string): string[] {
	switch (fieldtype) {
	    case 'year': let d = new Date(); return fillCount(1900, d.getFullYear()+1).map((x) => x.toString()).reverse(); 
	    case 'length (min)': return fillCount(0, 601, 15).map((x) => x.toString());
	    case 'IMDb rating': return fillCount(0, 10.1, 0.1).map((x) => x.toString());
	    case 'acclaim': return fillCount(0, 201, 10).map((x) => x.toString());
	    default: return [`error ${fieldtype}`]
	}
    }

    return (
	<>
	    <div className="container text-center">
		<div className="row">
		    { formstate.fields.map(({id, fieldtype, value}) => { if (fieldtype !== "") 
			{
			    if (dropdowns.map(x => x.fieldtype).includes(fieldtype)) 
			    return <DropdownInputField
				id={id}
				options={mapDropdowns(fieldtype)}
				numberOfDropdowns={fieldtype.startsWith("genre") ? formstate.genrecount : 1}
				fieldtype={fieldtype}
				value={value} 
				formstate={formstate}
			    action={setFormstate} />

			    if (doubleDropdowns.includes(fieldtype)) 
			    return <DoubleDropdownInputField 
				id={id}
				options={mapDoubleDropdowns(fieldtype)}
				fieldtype={fieldtype}
				value={value} 
				formstate={formstate}
			    action={setFormstate} />

			    return <TextInputField id={id} formstate={formstate} submitForm={submitForm} action={setFormstate} fieldtype={fieldtype} value={value} /> 
			}
			}) 
		    }

		    {
			// including the field adder select if there are still fields that can be added <= 08/16/23 17:49:42 // 
			formstate.availableFieldtypes.length > 0 ? <FieldAdder
								    name="fieldadder"
								    formstate={formstate}
								    action={setFormstate}
								    title="choose"
								    options={formstate.availableFieldtypes} /> : ""
		    }

		    { 
			// Submit button <= 08/14/23 18:58:02 // 
			formstate.count > 0 && <button onClick={async () => {  
			    submitForm()
			    }} className="button-50-grabber">Grab From My List</button> 
		    } 

		    {
			displaystate.state === "display" ? makeFilmCards(displaystate.filmdata) : 
			    displaystate.state === "text" ? displaystate.text.search(/error/i) < 0 ? 
				(displaystate.text.search(/^\s*$/) >= 0 ? <div className="alert alert-danger" role="alert">EMPTY RESPONSE</div> : 
				    <div className="alert alert-info" role="alert">{displaystate.text.toLocaleUpperCase()}</div>) : 
				<div className="alert alert-danger" role="alert">{displaystate.text.toLocaleUpperCase()}</div> : ""
		    }

		</div>
	    </div>
	</>
    )
}
