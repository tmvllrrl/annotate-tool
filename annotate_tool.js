

var currentStartIndex = 0;
var numRows = 2;
var numCols = 4;
var numShownImages = numRows * numCols;

// 0: Blood, 1: Bile
var fluidState = {};
// 0: low, 1: medium, 2: high
var confState = {};

// Stores the labels that have been reviewed up to this point
var reviewedLabels = {};

function updateImageQuestion(image, fluidLabel, confLabel, index) {
    document.getElementById(`image-${index}`).src = 'raw_data/'+image; 
    document.getElementById(`fluid-label-${index}`).innerHTML = fluidLabel.toUpperCase();
    document.getElementById(`conf-label-${index}`).innerHTML = confLabel.toUpperCase();
    document.getElementById(`image-name-${index}`).innerHTML = image;

    if (fluidLabel.toLowerCase() == "blood") {
        document.getElementById("label-border-" + index).style.border = "8px solid red";
    }
    else if (fluidLabel.toLowerCase() == "bile") {
        document.getElementById("label-border-" + index).style.border = "8px solid gold";
    }

    
    if (confLabel.toLowerCase() == "low") {
        document.getElementById(`conf-button-${index}`).style.backgroundColor = "red";
    }
    else if (confLabel.toLowerCase() == "medium") {
        document.getElementById(`conf-button-${index}`).style.backgroundColor = "gold";
    }
    else if (confLabel.toLowerCase() == "high") {
        document.getElementById(`conf-button-${index}`).style.backgroundColor = "green";
    }
}

function nextPage() {
    // Checking to see how many images left and providing user real or dummy images accordingly
    var check = images.length - currentStartIndex;
    var realImages;
    var dummyImages;

    if (check > numShownImages - 1) {
        realImages = numShownImages;
        dummyImages = 0;
    } 
    else {
        realImages = check;
        dummyImages = numShownImages - check;
    }

    for (var i = 0; i < realImages; i++) {

        // TODO: If user goes back, their work on that page gets deleted
        var image = images[currentStartIndex + i][0];
        var fluidType = images[currentStartIndex + i][1];
        var conf = images[currentStartIndex + i][2]; 
        
        reviewedLabels[image] = [fluidType, conf];

        // Update image html, using i to index html elements
        updateImageQuestion(image, reviewedLabels[image][0], reviewedLabels[image][1], i);

        // Set fluid state according to label
        if (fluidType.toLowerCase() == "blood") {
            fluidState[image] = 0;
        }
        else if (fluidType.toLowerCase() == "bile") {
            fluidState[image] = 1;
        }

        // Set conf state according to label
        if (conf.toLowerCase() == "low") {
            confState[image] = 0;
        }
        else if (conf.toLowerCase() == "medium") {
            confState[image] = 1;
        }
        else if (conf.toLowerCase() == "high") {
            confState[image] = 2;
        }

    }

    for (var i = check; i < (check + dummyImages); i++) {
        reviewedLabels["dummy.png"] = ["blood", "high"];
        updateImageQuestion("dummy.png", "blood", "high", i);
    }

    // Increase index by number of shown images for next page
    currentStartIndex += numShownImages;
}

function switchFluidState(index) {
    // Get image name using hidden element
    image = document.getElementById("image-name-" + index).innerHTML;

    var state = fluidState[image];

    // In blood state, switching to bile state
    if (state == 0) {
        // Switch state
        fluidState[image] = 1;

        // Update annotations
        reviewedLabels[image][0] = "bile";

        // Update image element
        updateImageQuestion(image, reviewedLabels[image][0], reviewedLabels[image][1], index);
    }
    // In bile state, switching to blood state
    else if (state == 1) {
        // Switch state
        fluidState[image] = 0;

        // Update annotations
        reviewedLabels[image][0] = "blood";

        // Update image element
        updateImageQuestion(image, reviewedLabels[image][0], reviewedLabels[image][1], index);
    }
    logLabels();
}

function switchConfState(index) {
    // Get image name using hidden element
    image = document.getElementById("image-name-" + index).innerHTML;

    var state = confState[image];

    // In low state, switching to medium state
    if (state == 0) {
        // Switch state
        confState[image] = 1;

        // Update annotations
        reviewedLabels[image][1] = "medium";

        // Update image element
        updateImageQuestion(image, reviewedLabels[image][0], reviewedLabels[image][1], index);
    }
    // In medium state, switching to high state
    else if (state == 1) {
        // Switch state
        confState[image] = 2;

        // Update annotations
        reviewedLabels[image][1] = "high";

        // Update image element
        updateImageQuestion(image, reviewedLabels[image][0], reviewedLabels[image][1], index);
    }
    // In high state, switching to low state
    else if (state == 2) {
        // Switch state
        confState[image] = 0;

        // Update annotations
        reviewedLabels[image][1] = "low";

        // Update image element
        updateImageQuestion(image, reviewedLabels[image][0], reviewedLabels[image][1], index);
    }
    logLabels();
}

function logLabels() {
    console.log(reviewedLabels);
}

function downloadLabels() {
    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(content)], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    download(reviewedLabels, 'reviewed_labels.txt', 'text/plain');
}

function jumpToImage() {
    var imageIndex = document.getElementById("image-index").value;
    if (imageIndex < 1 || imageIndex > images.length) {

    }
    else {
        // Subtracting by 2 b/c of zero indexing and nextImage auto increments by 1
        current_image = imageIndex - 2;
        nextImage();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    nextPage();
}, false);

function createGallery() {

    for (let i = 0; i < numRows; i++) {
        // Create row to store the cols in
        const row = document.createElement("div");
        row.setAttribute("class", "row");
        row.style.marginBottom = "16px";

        for (let j = 0; j < numCols; j++) {

            // Index uniquely identifies the imgs
            var index = (i * numCols) + (j);

            // Create col to append the image elements to
            const col = document.createElement("div");
            col.setAttribute("class", "col-sm");

            // Create the fluid label
            const fluidLabel = document.createElement("p");
            fluidLabel.id = `fluid-label-${index}`;
            fluidLabel.style.marginBottom = "4px";

            // Create the border the img is housed in
            const button = document.createElement("button");
            button.id = `label-border-${index}`;
            button.setAttribute("onclick", `switchFluidState(${index})`);

            const img = document.createElement("img");
            img.id = `image-${index}`;
            img.style.height = "150px";

            // Img goes inside the button
            button.appendChild(img);

            const br = document.createElement("br");

            // Create button for switching conf state
            const confButton = document.createElement("button");
            confButton.id = `conf-button-${index}`;
            confButton.setAttribute("onclick", `switchConfState(${index})`);
            confButton.style.width = "100px";

            const confLabel = document.createElement("p");
            confLabel.id = `conf-label-${index}`;

            // Confidence label goes inside the button
            confButton.appendChild(confLabel);

            // Create the name; used for storing reviewed labels
            const name = document.createElement("p");
            name.id = `image-name-${index}`;
            name.style.display = "none";

            // Create an individual col with attached elements
            col.appendChild(fluidLabel);
            col.appendChild(button);
            col.appendChild(br);
            col.appendChild(confButton);
            col.appendChild(name);

            // Append each created col to the row
            row.appendChild(col);

        }

        // Append the current row to the gallery
        document.getElementById("gallery").appendChild(row);
    }
    
}