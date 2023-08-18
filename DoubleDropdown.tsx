import React from 'react'
import { FormState } from './FilmGrabber'
import { useState } from 'react'

export default function DoubleDropdownInputField(
    {id, fieldtype, value, options, formstate, action}: {
	id: number,
	fieldtype: string,
	value: string,
	options: string[]
	formstate: FormState,
	action: React.Dispatch<React.SetStateAction<FormState>>
    }
) {
    // 08/08/23 19:59:27 => setting the state of the options, so as to avoid clashes where min selection is greater than max // 
    const [optionState, setOptionState] = useState({set: 0, optiona: options, optionaSelected: "", optionb: options, optionbSelected: ""})

    // 08/08/23 19:59:50 => defining the sets of html <option> tags // 
    let optionsHTMLa = [
	optionState.optionbSelected === "" ? 
	    <option selected={true} disabled={true}> select min {fieldtype.replace(" (minutes)", "")} </option> 
	    : <option selected={false} disabled={true}> select min {fieldtype.replace(" (minutes)", "")} </option>, 
	...optionState.optiona.map((str) => str === optionState.optionaSelected ? 
	    <option selected={true} value={str}>{str}</option> 
	    : <option selected={false} value={str}>{str}</option> )
    ]

    let optionsHTMLb = [
	<option selected={false} disabled={true}> select max {fieldtype.replace(" (minutes)", "")} </option>, 
	...optionState.optionb.map((str) => str === optionState.optionbSelected ? 
	    <option selected={true} value={str}>{str}</option> 
	    : <option selected={false} value={str}>{str}</option>),
	optionState.optionbSelected === "Infinity" || optionState.optionbSelected === "" ? 
	    <option selected={true} value="Infinity">Infinity</option> 
	    : <option selected={false} value="Infinity">Infinity</option>
    ]

    let optionsHTMLbNoInfinity = [
	optionState.optionbSelected === "" ? 
	    <option selected={true} disabled={true}> select max {fieldtype.replace(" (minutes)", "")} </option> 
	    : <option selected={false} disabled={true}> select max {fieldtype.replace(" (minutes)", "")} </option>, 
	...optionState.optionb.map((str) => str === optionState.optionbSelected ? 
	    <option selected={true} value={str}>{str}</option> 
	    : <option selected={false} value={str}>{str}</option>),
    ]

    const setSelectionToValue = (event: React.ChangeEvent<HTMLSelectElement>) => { 
	// modifying the dropdowns to avoid min greater than max etc <= 08/13/23 21:17:39 // 
	if (event.target.id.endsWith("a")) {
	    setOptionState({
		set: 1,
		optiona: optionState.optiona,
		optionaSelected: event.target.value,
		optionb: [...options.filter((x) => parseFloat(x) >= parseFloat(event.target.value))],
		optionbSelected: optionState.optionbSelected
	    })
	} else if (event.target.id.endsWith("b")) {
	    setOptionState({
		set: 1,
		optiona: [...options.filter((x) => parseFloat(x) <= parseFloat(event.target.value))],
		optionaSelected: optionState.optionaSelected,
		optionb: optionState.optionb,
		optionbSelected: event.target.value,
	    })
	}
	// updating formstate <= 08/13/23 21:17:45 // 
	action({count: formstate.count, 
	    availableFieldtypes: formstate.availableFieldtypes, 
	    genrecount: formstate.genrecount, 
	    fields: formstate.fields.map((field) => field.id === id ? 
		event.target.id.endsWith("a") ? 
		    {...field, value: value.replace(/(^.*)(-)/, event.target.value + "$2")} 
		    : event.target.id.endsWith("b") ? 
			{...field, value: value.replace(/(-)(.*$)/, "$1" + event.target.value)}
			: {...field, value: "error"}
		: field)})
    }

    return ( 
	<div className="inputGroup">
	    <span className="textFieldLabel " id="basic-addon1">{fieldtype}</span>
	    <span className="textFieldInputAndButton">
	    <select className="singleSelect" onChange={(event) => {setSelectionToValue(event)}} name={fieldtype + id.toString()} id={id.toString() + "a"}>
		{ optionsHTMLa }
	    </select>
	    <select className="singleSelect" onChange={(event) => {setSelectionToValue(event)}} name={fieldtype + id.toString()} id={id.toString() + "b"}>
		{ fieldtype === "year" ? optionsHTMLbNoInfinity : optionsHTMLb }
	    </select>
	    <span onClick={
		() => { action({
		    count: formstate.count-1,
		    availableFieldtypes: [...formstate.availableFieldtypes, fieldtype],
		    genrecount: formstate.genrecount,
		    fields: formstate.fields.filter((field) => field.id !== id)
		}) }
		} className="buttonText" id="basic-addon1">-</span>
		</span>
	</div>
    )
}
