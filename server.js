const express = require('express');
const path = require('path');
const fs = require('fs');
//const util = require('util');

const app = express();
const PORT = 3001;

//const readFromFile = util.promisify(fs.readFile);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>  res.sendFile(path.join(__dirname, 'public/index.html'))
);


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// GET request for notes
app.get('/api/notes', (req, res) => {

    console.info(`${req.method} request received to get notes`);
    //readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
            res.json(JSON.parse(data))
        }
      })
  });
  
  // POST request to add a note
  app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text, } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
      };
  
      // Convert the data to a string so we can save it
      //const noteString = JSON.stringify(newNote);
  
      // Write the string to a file
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new note
          parsedNotes.push(newNote);
  
          // Write updated note back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
  });

app.listen(PORT, () =>
  console.log(`app listening at http://localhost:${PORT}`)
);