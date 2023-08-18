import React from 'react'
import { FormState } from './FilmGrabber'

export default function TextInputField(
    {id, fieldtype, value, formstate, submitForm, action}: {
	id: number,
	fieldtype: string,
	value: string,
	formstate: FormState,
	submitForm: Function,
	action: React.Dispatch<React.SetStateAction<FormState>>
    }
) {
    return ( 
	<div className="inputGroup">
	    <span className="textFieldLabel" id="basic-addon1">{fieldtype}</span>
	    <span className="textFieldInputAndButton">
	    <input name={fieldtype.replace(/ /g, "")} 
		id={id.toString()}
		autoComplete="off" 
		type="text" 
		className="noBorder" 
		value={value}

		onKeyDown={(event) => { 
		    if (event.key === "Enter") {submitForm()}
		}}

		onChange={(event) => { action({
		    count: formstate.count,
		    availableFieldtypes: formstate.availableFieldtypes,
		    genrecount: formstate.genrecount,
		    fields: formstate.fields.map((field) => field.id === id ? {...field, value: event.target.value} : field)
		})}} 
	    />
	    {
		// doing the minus button <= 08/14/23 17:16:11 // 
	    }
	    <span onClick={
		() => { 
		    action({ count: formstate.count-1,
		    availableFieldtypes: [...formstate.availableFieldtypes, fieldtype],
		    genrecount: formstate.genrecount,
		    fields: formstate.fields.filter((field) => field.id !== id) }) 
		}
		} className="buttonText">-</span>
		</span>
	</div>
    )
}
