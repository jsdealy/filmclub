import FilmSearch from './FilmSearch.jsx'
export default function MainTainer({mode}) {
    let text = ""
    if (mode === "mylist") { text = "funky bitch" }
    if (mode === "filmsearch") { return <FilmSearch /> }
    if (mode === "mydata") { text = "honk" }
    return <div id="body" class="block padded">{text}</div>
}
