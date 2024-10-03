var numRows = 2;
var numCols = 3;
var numShownImages = numRows * numCols;
var currentStartIndex = -numShownImages;

// Stores the labels that have been reviewed up to this point
var reviewedLabels = {};

for (let i = 0; i < images.length; i++) {
    // Each entry looks like imageName: [imageName, color, consistency, drainage]
    reviewedLabels[images[i][0]] = [images[i][0], images[i][1], images[1][2], images[i][3]];
}

// Stores the labeler
var labeler = "none";

function updateItem(image, color, consistency, drainage, index) {
    document.getElementById(`image-${index}`).src = 'raw_data/'+image;
    document.getElementById(`image-number-${index}`).innerHTML = `Image #${(currentStartIndex) + index + 1}`; 
    document.getElementById(`color-label-${index}`).value = color;
    document.getElementById(`consistency-label-${index}`).value = consistency;
    document.getElementById(`drainage-label-${index}`).value = drainage;
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
        var color = reviewedLabels[Object.keys(reviewedLabels)[currentStartIndex+i]][1];
        var consistency = reviewedLabels[Object.keys(reviewedLabels)[currentStartIndex+i]][2];
        var drainage = reviewedLabels[Object.keys(reviewedLabels)[currentStartIndex+i]][3];

        // Update image html, using i to index html elements
        updateItem(image, color, consistency, drainage, i);
    }

    for (var i = check; i < (check + dummyImages); i++) {
        updateItem("dummy.png", "sanguineous", "thick/viscous", "enteric", i);
    }

    // save();
}

function switchColorState(index) {
    // Need to get image name to alter reviewed labels
    var image = document.getElementById(`image-name-${index}`).innerHTML;
    // Getting up-to-date color value
    var color = document.getElementById(`color-label-${index}`).value;

    reviewedLabels[image][1] = color;
}

function switchConsistencyState(index) {
    // Need to get image name to alter reviewed labels
    var image = document.getElementById(`image-name-${index}`).innerHTML;
    // Getting up-to-date color value
    var consistency = document.getElementById(`consistency-label-${index}`).value;

    reviewedLabels[image][2] = consistency;
}

function switchDrainageState(index) {
    // Need to get image name to alter reviewed labels
    var image = document.getElementById(`image-name-${index}`).innerHTML;
    // Getting up-to-date color value
    var drainage = document.getElementById(`drainage-label-${index}`).value;

    reviewedLabels[image][3] = drainage;
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

            // Create the border the img is housed in
            const button = document.createElement("button");
            button.id = `zoom-${index}`;
            button.setAttribute("onclick", `switchZoom(${index})`);

            const img = document.createElement("img");
            img.id = `image-${index}`;
            img.style.height = "200px";

            // Img goes inside the button
            button.appendChild(img);

            // imageCol order: Title -> Button (contains Image)
            imageCol.appendChild(title);
            imageCol.appendChild(button);

            // Add imageCol to single item row
            itemRow.appendChild(imageCol);

            // LABELS COLUMN ////////////////////////////////////////
            // Col element for the 3 labels
            const labelCol = document.createElement("div");
            labelCol.setAttribute("class", "col");

            // Color Label
            var colorLabelValues = ["None", "Serous", "Sanguineous", "Serosanguineous",
                "Chylous", "Bilious", "Purulent", "Hemorrhagic", "Feculent"
            ];

            const colorLabelSelect = document.createElement("select");
            colorLabelSelect.setAttribute("onchange", `switchColorState(${index})`);
            colorLabelSelect.id = `color-label-${index}`;
            colorLabelSelect.style.marginBottom = "16px";

            for (let i = 0; i < colorLabelValues.length; i++) {
                var option = document.createElement("option");
                option.value = colorLabelValues[i].toLowerCase();
                option.text = colorLabelValues[i];
                colorLabelSelect.appendChild(option);
            }
            
            const colorLabelTitle = document.createElement("span");
            colorLabelTitle.innerHTML = "Color:"

            // Add Color Label items
            labelCol.appendChild(colorLabelTitle);
            labelCol.appendChild(document.createElement("br"));
            labelCol.appendChild(colorLabelSelect);
            labelCol.appendChild(document.createElement("br"));
            
            // Consistency Label 
            var consistencyLabelValues = ["None", "Thin/Watery", "Thick/Viscous",
                "Clotted", "Oily", "Mucous"
            ];

            const consistencyLabelSelect = document.createElement("select");
            consistencyLabelSelect.setAttribute("onchange", `switchConsistencyState(${index})`);
            consistencyLabelSelect.id = `consistency-label-${index}`;
            consistencyLabelSelect.style.marginBottom = "16px";

            for (let i = 0; i < consistencyLabelValues.length; i++) {
                var option  = document.createElement("option");
                option.value = consistencyLabelValues[i].toLowerCase();
                option.text = consistencyLabelValues[i];
                consistencyLabelSelect.appendChild(option);
            }

            const consistencyLabelTitle = document.createElement("span");
            consistencyLabelTitle.innerHTML = "Consistency:"

            // Add Consistency Label items
            labelCol.appendChild(consistencyLabelTitle);
            labelCol.appendChild(document.createElement("br"));
            labelCol.appendChild(consistencyLabelSelect);
            labelCol.appendChild(document.createElement("br"));

            // Drainage Label
            var drainageLabelValues = ["None", "Lymphatic", "Biliary", "Pancreatic",
                "Enteric", "Hemorrhagic",
            ];

            const drainageLabelSelect = document.createElement("select");
            drainageLabelSelect.setAttribute("onchange", `switchDrainageState(${index})`);
            drainageLabelSelect.id = `drainage-label-${index}`;
            drainageLabelSelect.style.marginBottom = "16px";

            for (let i = 0; i < drainageLabelValues.length; i++) {
                var option = document.createElement("option");
                option.value = drainageLabelValues[i].toLowerCase();
                option.text = drainageLabelValues[i];
                drainageLabelSelect.appendChild(option);
            }

            const drainageLabelTitle = document.createElement("span");
            drainageLabelTitle.innerHTML = "Drainage:";

            // Add Drainage Label items
            labelCol.appendChild(drainageLabelTitle);
            labelCol.appendChild(document.createElement("br"));
            labelCol.appendChild(drainageLabelSelect);
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
    localStorage.setItem("colorState", JSON.stringify(colorState));
    localStorage.setItem("consistencyState", JSON.stringify(consistencyState));
    localStorage.setItem("drainageState", JSON.stringify(drainageState));
    localStorage.setItem("reviewedLabels", JSON.stringify(reviewedLabels));
}

function resume() {
    currentStartIndex = Number(localStorage.getItem("currentStartIndex"));
    colorState = JSON.parse(localStorage.getItem("colorState"));
    consistencyState = JSON.parse(localStorage.getItem("consistencyState"));
    drainageState = JSON.parse(localStorage.getItem("drainageState"));
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
 * Dictionary containing (imageName: state) pairs for color label
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
var colorState = {};

/**
 * Dictionary containing (imageName: state) pairs for consistency label
 * 
 * State number: Label
 * 0: thin/watery
 * 1: thick/viscous
 * 2: clotted
 * 3: oily
 * 4: mucous
 * 
 */
var consistencyState = {};

/**
 * Dictionary containing (imageName: state) pairs for drainage label
 * 
 * State number: Label
 * 0: lymphatic
 * 1: biliary
 * 2: pancreatic
 * 3: enteric
 * 4: hemorrhagic
 * 
 */
var drainageState = {};

function setColorState(color, image) {
    switch(color) {
        case "serous":
            colorState[image] = 0;
            break;
        case "sanguineous":
            colorState[image] = 1;
            break;
        case "serosanguineous":
            colorState[image] = 2;
            break;
        case "chylous":
            colorState[image] = 3;
            break;
        case "bilious":
            colorState[image] = 4;
            break;
        case "purulent":
            colorState[image] = 5;
            break;
        case "hemorrhagic":
            colorState[image] = 6;
            break;
        case "feculent":
            colorState[image] = 7;
    }
}

function setConsistencyState(consistency, image) {
    switch(consistency) {
        case "thin/watery":
            consistencyState[image] = 0;
            break;
        case "thick/viscous":
            consistencyState[image] = 1;
            break;
        case "clotted":
            consistencyState[image] = 2;
            break;
        case "oily":
            consistencyState[image] = 3;
            break;
        case "mucous":
            consistencyState[image] = 4;
    }
}

function setDrainageState(drainage, image) {
    switch(drainage) {
        case "lymphatic":
            drainageState[image] = 0;
            break;
        case "biliary":
            drainageState[image] = 1;
            break;
        case "pancreatic":
            drainageState[image] = 2;
            break;
        case "enteric":
            drainageState[image] = 3;
            break;
        case "hemorrhagic":
            drainageState[image] = 4;
    }
}