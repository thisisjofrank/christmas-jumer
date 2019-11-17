class ActiveImageSelector {
    constructor(snakeFrames = true) {
        this._snakeFrames = snakeFrames;
    }

    execute(mostRecentSong) {
        if(mostRecentSong === "default") {
            return "default";
        }

        const cleaned = mostRecentSong.toLowerCase();
        const map = {
            "jingle bell rock": "bell",
            "let it snow! let it snow! let it snow!": "snow",
            "rockin' around the christmas tree": "tree",
            "santa claus is coming to town": "santa",
            "deck the halls": "holly",
            "we wish you a merry christmas": "pud",
            "fairytale of new york (feat. kirsty maccoll)": "star",
            "white christmas": "snow",
            "sleigh ride": "sled",
            "jingle bells - 1": "bell",
            "christmas alphabet": "sock",
            "santa baby": "hat",
            "all i want for christmas is you": "gift",
            "it's the most wonderful time of the year": "candy",
            "rudolph the red-nosed reindeer": "deer",
            "frosty the snowman": "frosty"
        };

        return map[cleaned];
    }

    getFrames(mostRecentSong) {
        const imageKey = this.execute(mostRecentSong);
//
    }
}

module.exports = ActiveImageSelector;
