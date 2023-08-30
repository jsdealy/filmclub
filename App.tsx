import React, {useState} from 'react';
import './styles-fc.css'
import FilmGrabber from './FilmGrabber'
import MyList from './MyList'
import getcred, {Cred} from './getCred'
import MyListHandle from './MyListHandle'

// 08/05/23 14:08:12 => the App function // 
function App() {
    const [loginState, setLoginState] = useState({login: false, username: ""})
    const buttonNames = [ "Film Grabber", "Club Data", "My Data", "My List" ]
    getcred((ls: Cred) => { 
	if (ls.login !== loginState.login && ls.username !== loginState.username) { 
	    console.log("login state: " + JSON.stringify(loginState)); setLoginState(ls) 
    }})


    return (
	<>
	    <div className="accordion container header" id="accordionExample">
		    { buttonNames.map((name, i) => 
			{
			    return <>
				    <div className="accordion-item">
					<h2 className="accordion-header">
					    <button
						className="accordion-button acbutton collapsed"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target={`#collapse${i}`}
						aria-expanded="true"
						aria-controls={`collapse${i}`}>
						{name}
					    </button>
					</h2>
					<div id={`collapse${i}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
					    <div className="accordion-body">
					{ name === "Film Grabber" ? <FilmGrabber /> : name === "My List" && loginState.login == true ? 
					    <MyList /> : "On the way!" }
					    </div>
					</div>
				    </div>
			    </>
			}) 
		    }
		</div>
	</>
    )
}

export default App
