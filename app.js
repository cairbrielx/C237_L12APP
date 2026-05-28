// Import required modules
const express = require('express');

// Create an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));

let spendings = [
    {
        id: 1,
        item: 'Lego UCS Tie Interceptor',
        category: 'Toys',
        amount: 249.99,
        date: '2026-05-20',
        notes: 'Bought after school',
        favourite: true
    },
    {
        id: 2,
        item: 'Chicken Rice',
        category: 'Food',
        amount: 5.50,
        date: '2026-05-21',
        notes: 'Lunch near school.',
        favourite: false
    }
];

app.get('/', (req, res) => {
    const totalAmount = spendings.reduce((total, spending) => total + Number(spending.amount), 0);
    const favouriteCount = spendings.filter(spending => spending.favourite).length;

    res.render('index', { totalAmount, favouriteCount, totalItems: spendings.length });
});

app.get('/spendings', (req, res) => {
    const search = req.query.search || "";

    const filteredSpendings = spendings.filter(spending =>
        spending.item.toLowerCase().includes(search.toLowerCase()) ||
        spending.category.toLowerCase().includes(search.toLowerCase())
    );

    res.render('list', { 
        spendings: filteredSpendings,
        search: search
    });
});
app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    const { item, category, amount, date, notes, favourite } = req.body;

    spendings.push({
        id: Date.now(),
        item,
        category,
        amount: Number(amount),
        date,
        notes,
        favourite: favourite === 'on'
    });

    res.redirect('/spendings');
});

app.get('/spendings/:id', (req, res) => {
    const spending = spendings.find(spending => spending.id == req.params.id);

    if (!spending) {
        return res.redirect('/spendings');
    }

    res.render('details', { spending });
});

app.get('/edit/:id', (req, res) => {
    const spending = spendings.find(spending => spending.id == req.params.id);

    if (!spending) {
        return res.redirect('/spendings');
    }

    res.render('edit', { spending });
});

app.post('/edit/:id', (req, res) => {
    const spending = spendings.find(spending => spending.id == req.params.id);

    if (!spending) {
        return res.redirect('/spendings');
    }

    spending.item = req.body.item;
    spending.category = req.body.category;
    spending.amount = Number(req.body.amount);
    spending.date = req.body.date;
    spending.notes = req.body.notes;
    spending.favourite = req.body.favourite === 'on';

    res.redirect('/spendings');
});

app.post('/delete/:id', (req, res) => {
    spendings = spendings.filter(spending => spending.id != req.params.id);
    res.redirect('/spendings');
});
app.get('/favourite', (req, res) => {

    const favouriteSpendings = spendings.filter(
        spending => spending.favourite
    );

    res.render('favourite', {
        spendings: favouriteSpendings
    });

});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});