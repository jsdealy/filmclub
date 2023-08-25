import React, { useState } from 'react';
import '../styles-fc.css'

// 08/05/23 14:08:12 => the App function // 
function App() {
    const [formstate, setFormstate] = useState({state: "login", fields: {username: "", password: "", confirm: ""}})

    const [displaystate, setDisplaystate] = useState({state: "form", text: ""})

    function checkHandler(event: React.ChangeEvent<HTMLInputElement>) {
	if (event.target.checked) {setFormstate({state: "register", fields: formstate.fields})}  
	else setFormstate({state: "login", fields: {...formstate.fields, confirm: ""}})
    }

    function checkUsername(str: string): boolean {
	return str.search(/[^\w]/) < 0
    }
    
    function checkPassword(str: string): boolean {
	return str.search(/[A-Z]/) >= 0 && str.search(/[a-z]/) >= 0 && str.search(/[0-9]/) >= 0 && str.search(/[\_\*\$\@\!\^\&\#\%\)\(]/) >= 0 && str.length >= 8
    }

    async function submitLoginOrRegister() {
	setDisplaystate({state: "text", text: "Loading..."}); 
	let formData = new FormData()

	// calling sanitizeFieldsForAPI <= 08/13/23 12:57:00 // 
	formData.append(formstate.state, JSON.stringify(formstate.fields))

	// calling fetch and storing the response <= 08/12/23 19:58:32 // 
	let resPromise = await fetch("/filmclub/loginRegister/loginRegisterAPI.php", {method: "POST", body: formData}); 

	let strResponse = await resPromise.text()
	console.log("server response: >" + strResponse + "<")

	try {
	    let resOb: {status: string, message: string} = JSON.parse(strResponse)
	    if (resOb.status === "success") {

		setDisplaystate({state: "text", text: "success"})
		setTimeout(()=> { window.location.href = "https://www.justindealy.org/filmclub" }, 3000)

	    } else if (resOb.status === "failure" ) {

		setDisplaystate({state: "text", text: resOb.message})

	    }
	}
	catch (e) {
	    // response body didn't parse as JSON so we display the message received <= 08/15/23 10:16:08 // 
	    console.log(e)
	    setDisplaystate({state: "text", text: "ERROR: " + e + " /// SERVER RESPONSE: " + strResponse})
	}
    }

    if (displaystate.state === "form") {
	return (
	    <>
		{ JSON.stringify(formstate) }
		<div className="container">
		    <form>
			<div className="input-group mb-3">
			    <span className="input-group-text">Username</span>
			    <input type="text" className="form-control" id="username"
			    onChange={(event) => { setFormstate({state: formstate.state, fields: {...formstate.fields, username: event.target.value}}) }}
				autoFocus={true}
				autoComplete="off"
			    />
			</div>
			{
			    checkUsername(formstate.fields.username) ? 
				"" : 
			    <div className="mb-3"><label className="alertText">Your username may only include alphanumeric characters and the underscore.</label></div>
			}
			<div className="input-group mb-3">
			    <span className="input-group-text">Password</span>
			    <input type="password" autoComplete="false" 
				style={{
				    backgroundColor: formstate.state === "login" ? "white" : 
					(formstate.fields.password === "" || checkPassword(formstate.fields.password) ? "unset" : "pink")
				}} 
				className="form-control" id="confirm"
			    onChange={(event) => { setFormstate({state: formstate.state, fields: {...formstate.fields, password: event.target.value}}) }}
			    />
			</div>
			{
			    formstate.state !== "register" || checkPassword(formstate.fields.password) ? 
				"" : 
				<label className="alertText">Your password should include <ul> 
				<li>one uppercase letter,</li> 
				<li>one lowercase letter,</li> 
				    <li>one digit,</li> 
				    <li>one special character (#&^ etc.),</li> 
				    <li>and should be at least eight characters long.</li></ul></label>
			}
			{
			    formstate.state == "register" ? 
				<div className="input-group mb-3">
				    <span className="input-group-text">Confirm Password</span>
				    <input type="password" autoComplete="false" className="form-control" id="confirm" 
					style={{backgroundColor: (formstate.fields.confirm === "" || formstate.fields.password === formstate.fields.confirm ? "unset" : "pink") }} 
					onChange={(event) => { setFormstate({state: formstate.state, fields: {...formstate.fields, confirm: event.target.value}}) }}
				    />
			    </div> : ""
			}
			{
			    formstate.state === "login" || formstate.fields.confirm === "" || formstate.fields.confirm === formstate.fields.password ? 
				"" : 
			    <div className="mb-3"><label className="alertText">Your password and confirmation don't match.</label></div>
			}
			<div className="mb-2 form-check">
			    <input
				type="checkbox"
			    onChange={(event) => { checkHandler(event) }}
				className="form-check-input" id="needToRegister" />
			    <label className="form-check-label">I need to register.</label>
			</div>
			{
			    formstate.state === "register" ? 
				( formstate.fields.password === formstate.fields.confirm && checkUsername(formstate.fields.username) && checkPassword(formstate.fields.password) ? 
				    <button type="submit" onClick={() => { submitLoginOrRegister() }} className="btn btn-primary">Submit</button> : ""
				) : formstate.fields.username !== "" && formstate.fields.password !== "" ? <button type="submit" 
				    onClick={() => { submitLoginOrRegister() }} className="btn btn-primary">Submit</button> : ""
			}
		    </form>
		</div> 
	    </>
	)
    } else if (displaystate.state === "text"){
	return (
	    <>
		<div className="container">
		    <div className="alert alert-primary" role="alert">
			{ displaystate.text }
		    </div>
		</div>
	    </>

	)
    }

}

export default App
