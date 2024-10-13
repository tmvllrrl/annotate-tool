var numRows = 2;
var numCols = 4;
var numShownImages = numRows * numCols;
var currentStartIndex = -numShownImages;

// Stores the labels that have been reviewed up to this point
var reviewedLabels = {};

for (let i = 0; i < images.length; i++) {
    // Each entry looks like imageName: [imageName, primary, secondary, notes]
    reviewedLabels[images[i][0]] = [images[i][0], images[i][1], images[1][2], images[i][3]];
}

// Stores the labeler
var labeler = "none";

function updateItem(image, primary, secondary, notes, index) {
    document.getElementById(`image-${index}`).src = `raw_data/${image}`;
    document.getElementById(`image-number-${index}`).innerHTML = `Image #${(currentStartIndex) + index + 1}`; 
    document.getElementById(`primary-label-${index}`).value = primary;
    document.getElementById(`secondary-label-${index}`).value = secondary;
    document.getElementById(`notes-label-${index}`).innerHTML = notes;
    document.getElementById(`image-name-${index}`).innerHTML = image;
}

function nextPage() {
    // Increase index by number of shown images for next page
    currentStartIndex += numShownImages;

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

        var image = reviewedLabels[Object.keys(reviewedLabels)[currentStartIndex+i]][0];
        var primary = reviewedLabels[Object.keys(reviewedLabels)[currentStartIndex+i]][1];
        var secondary = reviewedLabels[Object.keys(reviewedLabels)[currentStartIndex+i]][2];
        var notes = reviewedLabels[Object.keys(reviewedLabels)[currentStartIndex+i]][3];

        // Update image html, using i to index html elements
        updateItem(image, primary, secondary, notes, i);
    }

    for (var i = check; i < (check + dummyImages); i++) {
        updateItem("dummy.png", "sanguineous", "thick/viscous", "enteric", i);
    }

    // save();
}

function switchPrimaryState(index) {
    // Need to get image name to alter reviewed labels
    var image = document.getElementById(`image-name-${index}`).innerHTML;
    // Getting up-to-date primary value
    var primary = document.getElementById(`primary-label-${index}`).value;

    reviewedLabels[image][1] = primary;
}

function switchSecondaryState(index) {
    // Need to get image name to alter reviewed labels
    var image = document.getElementById(`image-name-${index}`).innerHTML;
    // Getting up-to-date secondary value
    var secondary = document.getElementById(`secondary-label-${index}`).value;

    reviewedLabels[image][2] = secondary;
}

function saveNotes(index) {
    // Need to get image name to alter reviewed labels
    var image = document.getElementById(`image-name-${index}`).innerHTML;
    // Getting up-to-date color value
    var notes = document.getElementById(`notes-label-${index}`).innerHTML;

    reviewedLabels[image][3] = notes;
}

function switchZoom(index) {
    var imageSrc = document.getElementById(`image-${index}`);
    var height = imageSrc.style.height;

    // Zoom in
    if (height == "200px") {
        imageSrc.style.height = "400px";
    } 
    // Zoom out
    else if (height == "400px") {
        imageSrc.style.height = "200px";
    }
}

function downloadLabels() {
    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(content)], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    temp = {};
    for (let i = 0; i < currentStartIndex; i++) {
        temp[reviewedLabels[Object.keys(reviewedLabels)[i]][0]] = [
            reviewedLabels[Object.keys(reviewedLabels)[i]][0], 
            reviewedLabels[Object.keys(reviewedLabels)[i]][1], 
            reviewedLabels[Object.keys(reviewedLabels)[i]][2], 
            reviewedLabels[Object.keys(reviewedLabels)[i]][3]
        ];
    }
    download(temp, 'reviewed_labels.txt', 'text/plain');
}

document.addEventListener('DOMContentLoaded', function() {
    // resumeLabel();
    nextPage();
    loadLabeler();
}, false);

function rotateImage(index) {
    img = document.getElementById(`image-${index}`);
    button = document.getElementById(`zoom-${index}`);
    var width = img.width;
    console.log(width);
    if (width > 200) {

        img.style.transform = "rotate(90deg)";
        // button.style.transform = "rotate(90deg)";
        // img.style.height = 200;
    }
}

function createGallery() {

    for (let i = 0; i < numRows; i++) {
        // Create row to store the cols in
        const row = document.createElement("div");
        row.setAttribute("class", "row");
        row.style.marginBottom = "16px";

        for (let j = 0; j < numCols; j++) {

            const br = document.createElement("br");

            // Index uniquely identifies the imgs
            var index = (i * numCols) + (j);

            // Create col to append the image elements to
            const col = document.createElement("div");
            col.setAttribute("class", "col");
            col.style.backgroundColor = "#add8e6";
            col.style.margin = "8px";
            col.style.borderRadius = "8px";

            // Row to store the image and labels side-by-side
            const itemRow = document.createElement("div");
            itemRow.setAttribute("class", "row");

            // IMAGE COLUMN /////////////////////////////////////////
            // Col element for image
            const imageCol = document.createElement("div");
            imageCol.setAttribute("class", "col");

            // Put title, containing image number, over image
            const title = document.createElement("p");
            title.id = `image-number-${index}`;
            title.style.marginBottom = "4px";

            const img = document.createElement("img");
            img.id = `image-${index}`;
            img.style.height = "200px";
            img.setAttribute("onclick", `switchZoom(${index})`);
            // img.setAttribute("onload", `rotateImage(${index})`);

            // imageCol order: Title -> Image
            imageCol.appendChild(title);
            imageCol.appendChild(img);

            // Add imageCol to single item row
            itemRow.appendChild(imageCol);

            // LABELS COLUMN ////////////////////////////////////////
            // Col element for the 3 labels
            const labelCol = document.createElement("div");
            labelCol.setAttribute("class", "col");

            // Primary Label
            var primaryLabelValues = ["None", "Serous", "Sanguineous", "Serosanguineous",
                "Chylous", "Bilious", "Purulent", "Hemorrhagic", "Feculent"
            ];

            const primaryLabelSelect = document.createElement("select");
            primaryLabelSelect.setAttribute("onchange", `switchPrimaryState(${index})`);
            primaryLabelSelect.id = `primary-label-${index}`;
            primaryLabelSelect.style.marginBottom = "16px";

            for (let i = 0; i < primaryLabelValues.length; i++) {
                var option = document.createElement("option");
                option.value = primaryLabelValues[i].toLowerCase();
                option.text = primaryLabelValues[i];
                primaryLabelSelect.appendChild(option);
            }
            
            const primaryLabelTitle = document.createElement("span");
            primaryLabelTitle.innerHTML = "Primary:"

            // Add Primary Label items
            labelCol.appendChild(primaryLabelTitle);
            labelCol.appendChild(document.createElement("br"));
            labelCol.appendChild(primaryLabelSelect);
            labelCol.appendChild(document.createElement("br"));
            
            // Secondary Label 
            var secondaryLabelValues = ["None", "Thin/Watery", "Thick/Viscous",
                "Clotted", "Oily", "Mucous"
            ];

            const secondaryLabelSelect = document.createElement("select");
            secondaryLabelSelect.setAttribute("onchange", `switchSecondaryState(${index})`);
            secondaryLabelSelect.id = `secondary-label-${index}`;
            secondaryLabelSelect.style.marginBottom = "16px";

            for (let i = 0; i < secondaryLabelValues.length; i++) {
                var option  = document.createElement("option");
                option.value = secondaryLabelValues[i].toLowerCase();
                option.text = secondaryLabelValues[i];
                secondaryLabelSelect.appendChild(option);
            }

            const secondaryLabelTitle = document.createElement("span");
            secondaryLabelTitle.innerHTML = "Secondary:"

            // Add secondary Label items
            labelCol.appendChild(secondaryLabelTitle);
            labelCol.appendChild(document.createElement("br"));
            labelCol.appendChild(secondaryLabelSelect);
            labelCol.appendChild(document.createElement("br"));

            // Notes
            const notesEntry = document.createElement("textarea");
            notesEntry.setAttribute("onchange", `saveNotes(${index})`);
            notesEntry.id = `notes-label-${index}`;
            notesEntry.row = 2;
            notesEntry.col = 20;
            notesEntry.style.marginBottom = "16px";

            const notesLabelTitle = document.createElement("span");
            notesLabelTitle.innerHTML = "Notes:";

            // Add Notes Label items
            labelCol.appendChild(notesLabelTitle);
            labelCol.appendChild(document.createElement("br"));
            labelCol.appendChild(notesEntry);
            labelCol.appendChild(document.createElement("br"));

            // Create the name; used for storing reviewed labels
            const name = document.createElement("p");
            name.id = `image-name-${index}`;
            name.style.display = "none";
            labelCol.appendChild(name);

            // Add label column to item row
            itemRow.appendChild(labelCol);

            // Add item row to inner column
            col.appendChild(itemRow);

            // Append each created col to the row
            row.appendChild(col);
        }
        // Append the current row to the gallery
        document.getElementById("gallery").appendChild(row);
    }
}

function saveLabeler() {
    labeler = document.getElementById("labeler").value;
    localStorage.setItem("labeler", labeler);
}

function loadLabeler() {
    labeler = document.getElementById("labeler");
    labeler.value = localStorage.getItem("labeler");
}

function save() {
    // Saving index, state dictionaries, and reviewed labels to local storage for persistence
    localStorage.setItem("currentStartIndex", currentStartIndex);
    localStorage.setItem("reviewedLabels", JSON.stringify(reviewedLabels));
}

function resume() {
    currentStartIndex = Number(localStorage.getItem("currentStartIndex"));
    reviewedLabels = JSON.parse(localStorage.getItem("reviewedLabels"));
}

function prevPage() {
    if (currentStartIndex != 0) {
        currentStartIndex = currentStartIndex - (2 * numShownImages);
        nextPage();	
    }
}

// OBSOLETE COMPONENTS /////////////////////////////////////////////////////////////////////////////

/**
 * Dictionary containing (imageName: state) pairs for primary label
 * 
 * State number: Label
 * 0: serous
 * 1: sanguineous
 * 2: serosanguineous
 * 3: chylous
 * 4: bilious
 * 5: purulent
 * 6: hemorrhagic
 * 7: feculent
 * 
 */
var primaryState = {};

/**
 * Dictionary containing (imageName: state) pairs for secondary label
 * 
 * State number: Label
 * 0: thin/watery
 * 1: thick/viscous
 * 2: clotted
 * 3: oily
 * 4: mucous
 * 
 */
var secondaryState = {};

function setprimaryState(primary, image) {
    switch(primary) {
        case "serous":
            primaryState[image] = 0;
            break;
        case "sanguineous":
            primaryState[image] = 1;
            break;
        case "serosanguineous":
            primaryState[image] = 2;
            break;
        case "chylous":
            primaryState[image] = 3;
            break;
        case "bilious":
            primaryState[image] = 4;
            break;
        case "purulent":
            primaryState[image] = 5;
            break;
        case "hemorrhagic":
            primaryState[image] = 6;
            break;
        case "feculent":
            primaryState[image] = 7;
    }
}

function setsecondaryState(secondary, image) {
    switch(secondary) {
        case "thin/watery":
            secondaryState[image] = 0;
            break;
        case "thick/viscous":
            secondaryState[image] = 1;
            break;
        case "clotted":
            secondaryState[image] = 2;
            break;
        case "oily":
            secondaryState[image] = 3;
            break;
        case "mucous":
            secondaryState[image] = 4;
    }
}