import React, {useState} from 'react';
import './styles-fc.css'
import FilmGrabber from './FilmGrabber'
import MyList from './MyList'

// 08/05/23 14:08:12 => the App function // 
function App() {
    const [myListState, setMyListState] = useState("")
    const buttonNames = [ "Film Grabber", "Club Data", "My Data", "My List" ]


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
					{ name === "Film Grabber" ? <FilmGrabber /> : name === "My List" ? 
					    <MyList myListStateJSON={myListState} setMyListState={setMyListState} /> : "On the way!" }
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
