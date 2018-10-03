/* 
 * ©2018 Phith Productions.
 * All rights reserved.
 */
let gMajor = 0;
let gMinor = 1;
let gSuspended = 2;
let gDiminished = 3;
let gAugmented = 4;
let gFlatFive = 5;

var ChordFactory = {
    chord: {
        type: int = 0,
        numNotes: int = 3,
        root: int = 0,
        notes: Array,
        equivalent: boolean = false
    },
    numberToNoteName: function (num) {
        switch (num % 12) {
            case 0:
                return "C";
            case 1:
                return "Db";
            case 2:
                return "D";
            case 3:
                return "Eb";
            case 4:
                return "E";
            case 5:
                return "F";
            case 6:
                return "Gb";
            case 7:
                return "G";
            case 8:
                return "Ab";
            case 9:
                return "A";
            case 10:
                return "Bb";
            case 11:
                return "B";
        }
    },
    create: function (type, numNotes, root) {
        var chord = Object.assign({}, this.chord);
        chord.type = type;
        chord.numNotes = numNotes;
        chord.root = root;
        chord.notes = Array();
        chord.notes.push(this.numberToNoteName(root));
        switch (type) {
            case gMajor:
                chord.notes.push(this.numberToNoteName(root + 4));
                chord.notes.push(this.numberToNoteName(root + 7));
                break;
            case gMinor:
                chord.notes.push(this.numberToNoteName(root + 3));
                chord.notes.push(this.numberToNoteName(root + 7));
                break;
            case gSuspended:
                chord.notes.push(this.numberToNoteName(root + 5));
                chord.notes.push(this.numberToNoteName(root + 7));
                break;
            case gDiminished:
                chord.notes.push(this.numberToNoteName(root + 3));
                chord.notes.push(this.numberToNoteName(root + 6));
                break;
            case gAugmented:
                chord.notes.push(this.numberToNoteName(root + 4));
                chord.notes.push(this.numberToNoteName(root + 8));
                break;
            case gFlatFive:
                chord.notes.push(this.numberToNoteName(root + 4));
                chord.notes.push(this.numberToNoteName(root + 6));
                break;
            default:
                return null;
        }
        return chord;
    },
    clone: function (org) {
        var chord = Object.assign({}, this.chord);
        chord.type = org.type;
        chord.numNotes = org.numNotes;
        chord.root = org.root;
        chord.notes = new Array();
        for (var i = 0; i < org.numNotes; i++) {
            chord.notes.push(org.notes[i]);
        }
        return chord;
    },
    addSixths: function (chord) {
        var retArray = [];
        // flat six is augmented fifth; diminished + flat six is always enharmonic equivalent
        if ((chord.type !== gAugmented) && (chord.type !== gDiminished)) {
            var flatSix = this.clone(chord);
            flatSix.numNotes++;
            flatSix.notes.push(this.numberToNoteName(flatSix.root + 8));
            retArray.push(flatSix);
        }
        var naturalSix = this.clone(chord);
        naturalSix.numNotes++;
        naturalSix.notes.push(this.numberToNoteName(naturalSix.root + 9));
        retArray.push(naturalSix);
        return retArray;
    },
    addSevenths: function (chord) {
        var retArray = [];
        var flatSeven = this.clone(chord);
        flatSeven.numNotes++;
        flatSeven.notes.push(this.numberToNoteName(flatSeven.root + 10));
        retArray.push(flatSeven);
        var majorSeven = this.clone(chord);
        majorSeven.numNotes++;
        majorSeven.notes.push(this.numberToNoteName(majorSeven.root + 11));
        retArray.push(majorSeven);
        return retArray;

    },
    addNinths: function (chord) {
        var retArray = [];
        var flatNine = this.clone(chord);
        flatNine.numNotes++;
        flatNine.notes.push(this.numberToNoteName(flatNine.root + 13));
        retArray.push(flatNine);
        var majorNine = this.clone(chord);
        majorNine.numNotes++;
        majorNine.notes.push(this.numberToNoteName(majorNine.root + 14));
        retArray.push(majorNine);
        if ((chord.type !== gMinor) && (chord.type !== gDiminished)) {
            var sharpNine = this.clone(chord);
            sharpNine.numNotes++;
            sharpNine.notes.push(this.numberToNoteName(sharpNine.root + 15));
            retArray.push(sharpNine);

        }
        return retArray;
    },
    addElevenths: function (chord) {
        var retArray = [];
        if (chord.type !== gSuspended) {
            var eleven = this.clone(chord);
            eleven.numNotes++;
            eleven.notes.push(this.numberToNoteName(eleven + 17));
            retArray.push(eleven);
        }
        if ((chord.type !== gDiminished) && (chord.type !== gFlatFive)) {
            var sharpEleven = this.clone(chord);
            sharpEleven.numNotes++;
            sharpEleven.notes.push(this.numberToNoteName(sharpEleven.root + 18));
            retArray.push(sharpEleven);
        }
        return retArray;
    },
    addThirteenths: function (chord) {
        var retArray = [];
        if (chord.type !== gAugmented) {
            var flatThirteen = this.clone(chord);
            flatThirteen.numNotes++;
            flatThirteen.notes.push(this.numberToNoteName(flatThirteen.root + 20));
            retArray.push(flatThirteen);
        }
        var thirteen = this.clone(chord);
        thirteen.numNotes++;
        thirteen.notes.push(this.numberToNoteName(thirteen.root + 21));
        retArray.push(thirteen);
        // gonna skip #13, same as b7
        return retArray;
    }
};

var counter = {
    total: int = 0,
    triads: Array(),
    sixthChords: Array(),
    seventhChords: Array(),
    ninthChords: Array(),
    eleventhChords: Array(),
    thirteenthChords: Array(),
    run: function () {
        this.total += this.count2NoteChords();
        this.total += this.count3NoteChords();
        this.total += this.count4NoteChords();
        this.total += this.count5NoteChords();
        this.total += this.count6NoteChords();
        this.total += this.count7NoteChords();
    },
    count2NoteChords: function () {
        return 12; // only going to allow root + fifth
    },
    count3NoteChords: function () {
        for (var root = 0; root < 12; root++) {
            for (var type = gMajor; type <= gFlatFive; type++) {
                this.triads.push(ChordFactory.create(type, 3, root));
            }
        }
        this.removeEnharmonicEquivalents(this.triads);
        return this.countMinusEquivalents(this.triads);
    },
    count4NoteChords: function () {
        // this will be limited to sixths and sevenths
        var chords = new Array;
        for (var i = 0; i < this.triads.length; i++) {
            var chord = this.triads[i];
            chord.equivalent = false;
            var sixthChords = ChordFactory.addSixths(chord);    // an array of sixth chords
            for (var j = 0; j < sixthChords.length; j++) {
                this.sixthChords.push(sixthChords[j]);
                chords.push(sixthChords[j]);
            }
            var seventhChords = ChordFactory.addSevenths(chord);
            for (var k = 0; k < seventhChords.length; k++) {
                this.seventhChords.push(seventhChords[k]);
                chords.push(seventhChords[k]);
            }
        }
        this.removeEnharmonicEquivalents(chords);
        return this.countMinusEquivalents(chords);
    },
    count5NoteChords: function () {
        // we have 6/9 and ninth chords
        var chords = new Array;
        for (var i6 = 0; i6 < this.sixthChords.length; i6++) {
            var chord = this.sixthChords[i6];
            chord.equivalent = false;
            var ninthChords = ChordFactory.addNinths(chord);
            for (var j6 = 0; j6 < ninthChords.length; j6++) {
                this.ninthChords.push(ninthChords[j6]);
                chords.push(ninthChords[j6]);
            }
        }
        for (var i7 = 0; i7 < this.seventhChords.length; i7++) {
            var chord = this.seventhChords[i7];
            chord.equivalent = false;
            var ninthChords = ChordFactory.addNinths(chord);
            for (var j7 = 0; j7 < ninthChords.length; j7++) {
                this.ninthChords.push(ninthChords[j7]);
                chords.push(ninthChords[j7]);
            }
        }
        this.removeEnharmonicEquivalents(chords);
        return this.countMinusEquivalents(chords);
    },
    count6NoteChords: function () {
        var chords = new Array;
        for (var i = 0; i < this.ninthChords.length; i++) {
            var chord = this.ninthChords[i];
            chord.equivalent = false;
            var eleventhChords = ChordFactory.addElevenths(chord);
            for (var j = 0; j < eleventhChords.length; j++) {
                this.eleventhChords.push(eleventhChords[j]);
                chords.push(eleventhChords[j]);
            }
        }
        this.removeEnharmonicEquivalents(chords);
        return this.countMinusEquivalents(chords);
    },
    count7NoteChords: function () {
        var chords = new Array;
        for (var i = 0; i < this.eleventhChords.length; i++) {
            var chord = this.eleventhChords[i];
            chord.equivalent = false;
            var thirteenthChords = ChordFactory.addThirteenths(chord);
            for (var j = 0; j < thirteenthChords.length; j++) {
                this.thirteenthChords.push(thirteenthChords[j]);
                chords.push(thirteenthChords[j]);
            }
        }
        this.removeEnharmonicEquivalents(chords);
        return this.countMinusEquivalents(chords);
    },
    removeEnharmonicEquivalents: function (chordArray) {
        for (var i = 0; i < chordArray.length; i++) {
            for (var j = i + 1; j < chordArray.length; j++) {
                if (this.equivalent(chordArray[i], chordArray[j])) {
                    chordArray[j].equivalent = true;
                }
            }
        }
    },
    equivalent: function (chordA, chordB) {
        var numNotes = chordA.numNotes;
        for (var i = 0; i < numNotes; i++) {
            var oneNoteMatch = false;
            for (var j = 0; j < numNotes; j++) {
                if (chordA.notes[i] === chordB.notes[j]) {
                    oneNoteMatch = true;
                }
            }
            if (oneNoteMatch) {
                oneNoteMatch = false; // reset for next test
            } else {
                return false;
            }
        }
//    console.log("got a match", chordA, chordB);
        return true;    // passed the test
    },
    countMinusEquivalents: function (chordArray) {
        var total = 0;
        for (var i = 0; i < chordArray.length; i++) {
            if (!chordArray[i].equivalent) {
                total++;
            }
        }
        return total;
    }
};

counter.run();
document.getElementById('numChords').innerHTML = counter.total;