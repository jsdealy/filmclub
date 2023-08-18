import React from 'react'
import { useState } from 'react'
import { FormState } from './FilmGrabber'
import { dropdowns, doubleDropdowns } from './constArrays'


export default function FieldAdder(
    {name, title, formstate, action, options}: {
	name: string,
	title: string,
	formstate: FormState,
	action: React.Dispatch<React.SetStateAction<FormState>>,
	options: string[]
    }
) {
    const [currentSelection, setCurrentSelection] = useState("")

    function starry(str: string) {
	return str.startsWith("acclaim") ? str + "💫" : str
    }

    // building the list of options from the availableFieldtypes in the formstate, with the appropriate one selected <= 08/10/23 11:11:38 // 
    let optionsListHTML = [currentSelection === "" ? <option disabled selected={true}>{title}</option>
		    : <option disabled selected={false}>{title}</option>,
		      ...options.map((str, i) => { return currentSelection === str && formstate.availableFieldtypes.includes(currentSelection) ? 
						<option selected={true} value={str}>{starry(str)}</option>
						: currentSelection !== "" && i === 0 ? 
						<option selected={true} value={str}>{starry(str)}</option>
						: <option selected={false} value={str}>{starry(str)}</option> })
    ]

    const selectionHandler = (event: React.ChangeEvent<HTMLSelectElement>) => { 
	setCurrentSelection(event.target.value)
    }

    const getDropdownMultis = (fieldtype: string) => { 
	let dropdownRecord = dropdowns.find(x => x.fieldtype.startsWith(fieldtype))
	if (dropdownRecord === undefined) { alert("Error: getDropdownMultis"); return 0; } 
	else return dropdownRecord.multisAllowed
    }

    return (
	<div className="inputGroup">
	    <div className="selectorLabel">add a field</div>
	    <select className="fieldAdderSelect" onChange={(event) => { selectionHandler(event) }} id={name}>
		{ optionsListHTML }
	    </select>
	    {
		// 08/08/23 20:26:44 => making the + button // 
		currentSelection !== "" &&  
		<span onClick={() => { if (currentSelection !== "") {
			// getting current selection <= 08/12/23 15:28:37 // 
			let selectElement = document.getElementById(name) as HTMLSelectElement
			let selection = selectElement.value
			setCurrentSelection(selection)

			// updating formstate on click of the + <= 08/12/23 15:29:06 // 
			action({count: formstate.count + 1, 
			availableFieldtypes: [...formstate.availableFieldtypes.filter((x) => x !== selection 
											|| (x.startsWith("genre") && formstate.genrecount < getDropdownMultis(x) - 1))],
			genrecount: selection.startsWith("genre") ? formstate.genrecount + 1 : formstate.genrecount,
			fields: [...formstate.fields.filter(x => x.id > 0)].concat(selection.startsWith("genre") && formstate.genrecount > 0 ? [] : [{
				    id: formstate.count + 1,
				    fieldtype: selection,
				    value: doubleDropdowns.includes(selection) ? "0-Infinity" 
					    : dropdowns.map(x => x.fieldtype).includes(selection) ? "x|".repeat(dropdowns.findIndex(x => x.fieldtype === selection) >= 0 ? 
						    dropdowns[dropdowns.findIndex(x => x.fieldtype === selection)].multisAllowed : 1)  
						: ""
			}])})
			}}} className="buttonText goButton">+</span>
	    }
	</div>
    )
}
