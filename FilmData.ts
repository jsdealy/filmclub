export default class FilmData {

    constructor(raw: string[]) {
	let title = raw.at(1)
	let titlestring = ""
	if (title !== undefined) {
	    titlestring = title
	}

	this.imdb_id       = raw.at(0)
	this.englishTitle  = titlestring.substring(0, titlestring.indexOf(";"))
	this.originalTitle = titlestring.substring(titlestring.indexOf(";")+1)
	this.year       = raw.at(2)
	this.length     = raw.at(3)
	this.genre      = raw.at(4)
	this.rating     = raw.at(5)
	this.numratings = raw.at(6)
	this.language   = raw.at(7)
	this.directors  = raw.at(8)
	this.actors     = raw.at(9)
	this.writers    = raw.at(10)
	this.acclaim    = raw.at(12)
    }

    imdb_id:       string | undefined;
    englishTitle:  string | undefined;
    originalTitle: string | undefined;
    year:          string | undefined;
    length:        string | undefined;
    genre:         string | undefined;
    rating:        string | undefined;
    numratings:    string | undefined;
    language:      string | undefined;
    directors:     string | undefined;
    actors:        string | undefined;
    writers:       string | undefined;
    acclaim:       string | undefined;
}
