import React from 'react'
import { FormState } from './FilmGrabber'

export default function DropdownInputField(
    {id, fieldtype, options, numberOfDropdowns, formstate, action}: {
	id: number,
	fieldtype: string,
	value: string,
	options: string[]
	numberOfDropdowns: number,
	formstate: FormState,
	action: React.Dispatch<React.SetStateAction<FormState>>
    }
) {
    // creating the options-list html <= 08/10/23 09:44:55 // 
    let optionsHTML = [<option disabled={true} selected={true}>select {fieldtype}</option>, ...options.map((str) => { return <option value={str}>{str}</option> })]

    function replaceIthInterplus(str: string, i: number, rep: string) {
	let matchArray = str.match(/[^\|]+/g)
	if (matchArray) { matchArray[i] = rep; return matchArray.join("|") }
	return str
    }

    // function to set dropdown value in formstate to value selected in browser <= 08/10/23 09:43:08 // 
    const setSelectionToValue = (event: React.ChangeEvent<HTMLSelectElement>, i: number) => { 
	action({count: formstate.count, 
		availableFieldtypes: formstate.availableFieldtypes, 
		genrecount: formstate.genrecount, 
		fields: formstate.fields.map((field) => field.id === id ? {...field, value: replaceIthInterplus(field.value, i, event.target.value)} : field)})
    }

    // function to make the select dropdown based on how many dropdowns are needed <= 08/10/23 09:45:20 // 
    const makeSelectHTML = (drops: number) => { 
	let selects = []
	for (let i = 0; i < drops; i++) {
	    selects.push(
		<select
		    className="singleSelect"
		    onChange={(event) => {setSelectionToValue(event, i)}}
		    name={fieldtype + id.toString() + "." + i.toString()}
		    id={id.toString() + "." + i.toString()}>
		    { optionsHTML }
		</select>
	    )
	}
	// doing the minus button <= 08/10/23 09:42:19 // 
	selects.push(
	    <span onClick={
		() => { action({
		    count: formstate.count-1,
		    availableFieldtypes: fieldtype === "genre" && formstate.availableFieldtypes.includes("genre") ? 
			formstate.availableFieldtypes : [...formstate.availableFieldtypes, fieldtype],
		    genrecount: fieldtype.startsWith("genre") ? formstate.genrecount - 1 : formstate.genrecount,
		    fields: formstate.fields.filter((field) => 
			field.id !== id || fieldtype.startsWith("genre") && formstate.genrecount > 1).map((x) => 
			    x.fieldtype.startsWith("genre") && formstate.genrecount > 1 ? 
				{...x, value: replaceIthInterplus(x.value, formstate.genrecount - 1, "x")} : x)
		}) }
		} className="buttonText" id="basic-addon1">-</span>
	)
	return selects
    }

    return ( 
	<div className="inputGroup">
	    <span className="textFieldLabel " id="basic-addon1">{fieldtype}</span>
	    <span className="textFieldInputAndButton">
		{ makeSelectHTML(numberOfDropdowns) }
	    </span>
	</div>
    )
}
