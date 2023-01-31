const express = require('express');
const path = require('path');
const { writeToFile, readAndAppend, readFile } = require('./helpers/fsUtil');
const shortid = require('shortid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  readFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
})


app.post('/api/notes', (req, res) => {
  
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: shortid.generate()
    };
    console.log(newNote)

    readAndAppend(newNote, './db/db.json');
    res.json(`note added`);
  } else {
    res.error('Error in adding note');
    console.log("error")
  }
});

//maps id values and splices out the selected id. rewrites file with new content. 
app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id)
    
    readFile('./db/db.json')
      .then((data) => {
        const filteredData = JSON.parse(data) // .filter((elem) => elem.id !== id);
        let index = filteredData.map((note) => {return note.id}).indexOf(req.params.id);
        filteredData.splice(index, 1);
        console.log(index)
        return writeToFile('./db/db.json', filteredData);
      })
      .then(() => {
        res.json({ message: 'Note deleted successfully' });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: 'Error deleting note' });
      });
  });
  

//wild card redirects to homepage
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);