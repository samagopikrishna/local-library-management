var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
var moment = require('moment')
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
// Display list of all BookInstances.
exports.bookinstance_list = async function(req, res) {
    const bookInstances = await  BookInstance.find()
    .populate('book')
    return bookInstances;

};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = async function(id) {
   var res =  await BookInstance.find({ 'book': id})
   return res;
};

exports.bookinstance_details_byInstanceId = async function(id){
    try{
        var res = await BookInstance.findById(id)
        .populate('book')
    }
    catch(err)
    {
        console.log(err);
    }
    return res;

}

// Display BookInstance create form on GET.
exports.bookinstance_create_get =  function(req, res) {
    Book.find({},'title')
    .exec(async function (err, books) {
      if (err) { return next(err); }
      // Successful, so render.
        
  var   bookList = await JSON.parse(JSON.stringify(books))
      res.render('bookinstance_form', {title: 'Create BookInstance', book_list: bookList});
    });
    
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [

    // Validate fields.
    body('book', 'Book must be specified').trim().isLength({ min: 1 }),
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
    // Sanitize fields.
    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('due_back').toDate(),
    
    // Process request after validation and sanitization.
    async (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
       var bookId = await Book.findOne({ title:req.body.book}).select('_id');
        var bookinstance = new BookInstance(
          { book: bookId,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Book.find({},'title')
                .exec(async function (err, books) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    var   bookList = await JSON.parse(JSON.stringify(books))
                    res.render('bookinstance_form', { title: 'Create BookInstance', book_list: bookList, selected_book: bookinstance.book._id , errors: errors.array(), bookinstance: bookinstance });
            });
            return;
        }
        else {
            // Data from form is valid.
            bookinstance.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect(bookinstance.url);
                });
        }
    }
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = async function(req, res) {
    var bookInstance = await BookInstance.findById(req.params.id);
    var bookInstance1 = JSON.parse(JSON.stringify(bookInstance));
    res.status(200).render("bookInstance_delete",{
        title:"bookInstance Delete",
        bookInstance:bookInstance1

    })
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
    
    BookInstance.findByIdAndRemove(req.body.bookInstanceid, function deleteBookInstance(err) {
        if (err) { return next(err); }
        // Success - go to author list
        res.redirect('/catalog/bookinstances')
    })
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = async function(req, res) {
    var bookInstance =await BookInstance.findById(req.params.id);
    var book = await Book.find();
    var bookInstance1 = await JSON.parse(JSON.stringify(bookInstance));
    var status = [
        {
            name:'Maintenance'
        },
        {
            name:'Available',
        },
        {
            name: 'Loaned',
        },
        {
            name: 'Reserved'
        }
    ]
    if(bookInstance1.status=='Available')
    {
        bookInstance1.due_back_formatted = moment().format('MMMM Do, YYYY')
    }
    var book1  = await JSON.parse(JSON.stringify(book));
    res.status(200).render("bookInstance_Update",{
        title: "Update Book Instance",
        book:book1,
        bookInstance: bookInstance1,
        status:status
    })
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [

   
   
    // Validate fields.
    body('book', 'book must not be empty.').trim().isLength({ min: 1 }),
    body('imprint', 'imprint must not be empty.').trim().isLength({ min: 1 }),
    body('date', 'date must not be empty.').trim().isLength({ min: 1 }),
    body('status', 'status must not be empty').trim().isLength({ min: 1 }),

    // Sanitize fields.
    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('date').escape(),
    sanitizeBody('status').escape(),
    
    // Process request after validation and sanitization.
    async (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        var bookInstance2 = new BookInstance(
          { status: req.body.status,
            book: req.body.book,
            summary: req.body.summary,
            imprint: req.body.imprint,
            due_back: req.body.date,
            _id:req.params.id //This is required, or a new ID will be assigned!
           });

        if (!errors.isEmpty()) {
            var bookInstance =await BookInstance.findById(req.params.id);
            var book = await Book.find();
            var bookInstance1 = await JSON.parse(JSON.stringify(bookInstance));
            if(bookInstance1.status=='Available')
            {
                bookInstance1.due_back_formatted = moment().format('MMMM Do, YYYY')
            }
            var book1  = await JSON.parse(JSON.stringify(book));
            res.render('bookInstance_Update', { title: 'Update Book',authors: results.authors, bookInstance: bookInstance1, book: book1, errors: errors.array() });
        }
        else {
            // Data from form is valid. Update the record.
            BookInstance.findByIdAndUpdate(req.params.id, bookInstance2, {}, function (err,thebookInstance) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   res.redirect(thebookInstance.url);
                });
        }
    }
];