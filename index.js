/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Generate array of random numbers */
function atheniumGrading(scores) {

    var scoresWithGrades = [];

    while (scoresWithGrades.length < scores) {
        var randomNumber = Math.ceil(Math.random() * 100);
        var found = false;

        for (var i = 0; i < scoresWithGrades.length; i++) {
            if (scoresWithGrades[i] == randomNumber) {
                found = true;
                break;
            }
        }

        if (!found) {
            scoresWithGrades[scoresWithGrades.length] = randomNumber;
        }
    }

    return scoresWithGrades;
}

/* Determine if an integer passed into the function is a numerical value */
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/* Sort an array in descending order */
function sort(unsortedList) {
    return unsortedList.sort(function (a, b) {
        return b - a;
    });
}

/* Extract duplicates from an array into a separate array */
function findDuplicates(sortedList) {
    var results = [];
    for (var i = 0; i < sortedList.length - 1; i++) {
        if (sortedList[i + 1] == sortedList[i]) {
            results.push(sortedList[i]);
        }
    }
    return results;
}

/* Populate an array with a value, a set amount of times */
function fillArray(value, len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(value);
    }
    return arr;
}

function traditionalParse(unsortedList) {
    var sortedList = sort(unsortedList);
    var parsedGrades = [];

    // Iterate through the list of scores
    for (var index = 0; index < sortedList.length; ++index) {

        // Verify we are dealing with a numerical value
        if (!isNumber(sortedList[index])) {
            console.log("Numeric value not provided in grade list.");
            return false;
        }

        // Parse which grade the score associates to
        if (sortedList[index] >= 90) {
            parsedGrades.push({
                score: sortedList[index],
                grade: "A"
            });
        } else if (unsortedList[index] >= 80) {
            parsedGrades.push({
                score: sortedList[index],
                grade: "B"
            });
        } else if (unsortedList[index] >= 70) {
            parsedGrades.push({
                score: sortedList[index],
                grade: "C"
            });
        } else if (unsortedList[index] >= 60) {
            parsedGrades.push({
                score: sortedList[index],
                grade: "D"
            });
        } else {
            parsedGrades.push({
                score: sortedList[index],
                grade: "F"
            });
        }
    }
    return parsedGrades;
}

function relativeParse(unsortedList) {

    var sortedList = sort(unsortedList);
    var grades = [];
    var gradegroup = {
        buckets: ['A', 'B', 'C', 'D', 'F'],
        rounding: 'ceiling', // Floor | Ceiling
    };

    var duplicateScores = sort(findDuplicates(sortedList)); // Check for duplicates and store them if found, sort again just because
    var divNum = (Math.floor(sortedList.length / gradegroup.buckets.length)); // Divide the number of items by number of buckets, remove remainder
    var modNum = (sortedList.length % gradegroup.buckets.length); // Determine the remainder of the previous division
    // Generate the buckets in which the scores will be placed
    var gradeBuckets = fillArray(divNum, gradegroup.buckets.length);

    if (unsortedList.length < gradegroup.buckets.length) {
        console.log("Score list contains less than 5 values making a relative-performance based grade parsing system pointless. Reverting to a traditional parsing method.");
        return traditionalParse(unsortedList);
    }

    var bucketPointer = 0; // Determines current bucket you are traversing over
    var bucketCounter = 0; // Counter to determine how many scores to place in each bucket
    
    /*
        In the event that the grade buckets don't split evenly (modulo doesn't result in 0)
        we need to determine how to distribute the extra scores evenly amongst the grade
        buckets in which a score may be placed. This is determined in the configuration.
    */
    if (modNum != 0) {
        /*
            For each extra number over 0 we have after modulo, increase the value of a
            bucket by 1 until we run out (from left to right)
        */
        for (index = 0; index < modNum; ++index) {
            gradeBuckets[index]++;
        }

        /*
            Two options here, to either be generous and distribute the grades in the case of a
            score needing to be rounded between two grades so that it gets pushed up to the higher
            grade, or pushed down to the lower grade. Simply reversing the array distributes the grades
            on the D, F grade side of the bucket.
        */
        if (gradegroup.rounding == 'floor') {
            gradeBuckets.reverse();
            duplicateScores.reverse();
        }
    }
    
    for (var i = 0; i < sortedList.length; i++) {

        if (bucketCounter === gradeBuckets[bucketPointer]) {
            bucketPointer++; // Increment bucketPointer
            bucketCounter = 0; // Reset bucketCounter to zero
        }
        if (sortedList[i] === duplicateScores[0]) {
            grades.push({
                score: sortedList[i],
                grade: gradegroup.buckets[bucketPointer]
            });
           // duplicateScores.splice(0, 1);
        } 
        else{
            grades.push({
                score: sortedList[i], // The score we are parsing in the sortedList
                grade: gradegroup.buckets[bucketPointer] // The letter value associated with the bucket we are within
            });

            bucketCounter++;
        }
    }
    return grades;
}

function main() {

    console.log("\nNumber of scores we will be generating: ");
    var amount = getRandomInt(5, 30); // Generate the amount of values to generate
    console.log(amount);

    console.log("\nArray of scores generated to be input to the algorithm: ");
    var input = atheniumGrading(amount);
    console.log(JSON.stringify(input)); // Only using stringify to get output on one line

    console.log("\nLet's look at what a tradition parse would do to these scores: ");
    var traditionalGrades = traditionalParse(input);
    console.log(traditionalGrades);

    console.log("\nLet's look at what a relative performance parse would do to these scores: ");
    var tGrades = relativeParse(input);
    console.log(tGrades);


    console.log("\n\n\n//////////// EDGE CASES ////////////");
    var edgeCases = [
        [100, 100, 100, 100, 100, 100, 100],
        [100, 100, 90, 90, 90, 80, 70, 70, 60, 60],
        [77, 77, 77, 77, 77, 77, 43, 23, 75, 12, 46, 75, 23, 66]
    ];

    for (var index = 0; index < edgeCases.length; ++index) {
        console.log("\nEdge Case #" + (index + 1));
        console.log(relativeParse(edgeCases[index]));
    }
}

main();
