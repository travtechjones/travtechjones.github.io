// The Front object is loaded through the Front script added in the header of the main HTML.
// This object can be used to listen to conversation event data as it occurs on Front, and request information and to perform actions on Front.
// See what all it can do here: https://dev.frontapp.com/plugin.html

// This keeps back if Front has returned a conversation to the plugin.
let hasConversation;

// Listen for the `conversation` event from Front and print its contents, then load the contact to the plugin.
Front.on('conversation', function (data) {
  console.log('Event data', data);

  // Set the state.
  hasConversation = true;

  // Load the Contact information based off of the event data. And set tab to Info.
  loadContact(data.contact);
  showInfo();
});

// Listen for the `no_conversation` event.  This can happen when opened to Inbox Zero.
Front.on('no_conversation', function () {
  console.log('No conversation');

  // Set the state.
  hasConversation = false;

  // Display `No Contact` data and clear the notes and set the tab to Info.
  displayContactInfo ("No Contact", "-");
  displayCRMInfo("-", "-", "-");
  clearNotes();
  showInfo();
});

// Loads the contact once the body of the plugin is loaded.
// This will call our mocked CRM service for data and then add the contact information and notes to the page.
function loadContact(contact) {
  // Display Front contact info.
  displayContactInfo(contact.display_name, contact.handle);

  // Build and display our CRM data.
  const crmData = mockQueryCRM(contact.handle);
  displayCRMInfo(crmData.info.id, crmData.info.location, crmData.info.status);

  //  Load the notes from our CRM data.
  displayNotes(crmData.notes);
}

// Create another note to add to the list. 
function createNote() {
  if (!hasConversation) {
    console.log('No conversation selected.');
    return;
  }

  const note = mockPostNote();
  displayNote(note);
}

// Displays Front contact information.
function displayContactInfo (display_name, handle) {
  const nameElement = document.getElementById("name");
  const handleElement = document.getElementById("handle");

  nameElement.textContent = display_name || handle;
  handleElement.textContent = handle;
}

// Displays mocked CRM Info.
function displayCRMInfo (id, location, status) {
  const idElement = document.getElementById("id");
  const locationElement = document.getElementById("location");
  const statusElement = document.getElementById("status");

  idElement.textContent = id;
  locationElement.textContent = location;
  statusElement.textContent = status;
}

// Displays the mocked CRM notes.
function displayNotes(notes) {
  // Reset the Notes column to make room for the newly found notes.
  clearNotes();

  // Add each Note to the Notes Column object.
  notes.forEach(note => {
    displayNote(note);
  });
}

// Removes the currently displayed Notes.
function clearNotes() {
  const noteColumns = document.getElementById("notes");
  noteColumns.innerHTML = null;
}

// Set the tab to Info and hide Notes.
function showInfo() {
  const infoButton = document.getElementById("infoButton");
  const notesButton = document.getElementById("notesButton");
  infoButton.classList.add('selected');
  notesButton.classList.remove('selected');

  const infoSection = document.getElementById("infoSection");
  infoSection.classList.remove("displayNone");
  const notesSection = document.getElementById("notesSection");
  notesSection.classList.add("displayNone");
}

// Set the tab to Notes and hide Info.
function showNotes() {
  const infoButton = document.getElementById("infoButton");
  const notesButton = document.getElementById("notesButton");
  infoButton.classList.remove('selected');
  notesButton.classList.add('selected');

  const infoSection = document.getElementById("infoSection");
  infoSection.classList.add("displayNone");
  const notesSection = document.getElementById("notesSection");
  notesSection.classList.remove("displayNone");
}

function displayNote(note) {
  const noteColumns = document.getElementById("notes");
  // Build the shadowed backdrop for the Note.
  let noteBlock = document.createElement("div");
  noteBlock.classList.add("noteBlock");

  // Build the Header of the note containing the author and the time written.
  let noteHeader = document.createElement("p");
  noteHeader.classList.add("row");

  let noteHeaderAuthor = document.createElement("div");
  noteHeaderAuthor.innerHTML = note.author;
  noteHeaderAuthor.classList.add("font", "noteKey");

  let noteHeaderTime = document.createElement("div");
  noteHeaderTime.innerHTML = note.time;
  noteHeaderTime.classList.add("font", "noteValue");

  noteHeader.appendChild(noteHeaderAuthor);
  noteHeader.appendChild(noteHeaderTime);

  // Build the blurb of the note; 
  let noteBlurb = document.createElement("p");
  noteBlurb.textContent = note.blurb;
  noteBlurb.classList.add("row", "font");

  // Append the Header and the Blurb to the Note block.
  noteBlock.appendChild(noteHeader);
  noteBlock.appendChild(noteBlurb);
  noteColumns.appendChild(noteBlock);
}
