
var Author = require('../models/author');
var Book = require('../models/book');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
// Display list of all Authors.
exports.author_list = async function(req, res) {
    var auhors = {};
    var result  = await Author.find({})
    
    return result;
    
};

// Display detail page for a specific Author.
exports.author_detail = async function(id) {
    try{
   var res=  await Author.findById(id)
    }
    catch(err)
    {
        console.log(err);
    }
    return res;
};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
    res.render('author_form', { title: 'Create Author'});
};

// Handle Author create on POST.
exports.author_create_post = [

    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('first_name').escape(),
    sanitizeBody('family_name').escape(),
    sanitizeBody('date_of_birth').toDate(),
    sanitizeBody('date_of_death').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var author = new Author(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death
                });
            author.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(author.url);
            });
        }
    }
];

// Display Author delete form on GET.
exports.author_delete_get = async function(req, res) {
    var author1 = await   Author.findById(req.params.id);
    var authors_books1 = await Book.find({ 'author': req.params.id });
var author = await JSON.parse(JSON.stringify(author1))
var authors_books = await JSON.parse(JSON.stringify(authors_books1))
    


   
    res.status(200).render('author_delete',{title: 'Delete Author', author: author, author_books: authors_books})
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
        if (err) { return next(err); }
        // Success - go to author list
        res.redirect('/catalog/authors')
    })
};

// Display Author update form on GET.
exports.author_update_get = async function(req, res) {
    var author = await Author.findById(req.params.id);
    var author1 = JSON.parse(JSON.stringify(author));
    res.status(200).render("author_update_form",{
        title:"Update Author",
        author: author1
    })
   
};

// Handle Author update on POST.
exports.author_update_post = [
   
   
    // Validate fields.
    body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('lastName').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('birthDate', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
    body('dateOfDeath', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('firstName').escape(),
    sanitizeBody('lastname').escape(),
    sanitizeBody('birthDate').toDate(),
    sanitizeBody('dateOfDeath').toDate(),

    // Process request after validation and sanitization.
    async (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped/trimmed data and old id.
        
            var author = new Author(
                { first_name:req.body.firstName,
                  family_name:req.body.lastName,
                  date_of_birth: req.body.birthDate,
                  date_of_death: (JSON.stringify(req.body.dateOfDeath).length) ? 'present' : req.body.dateOfDeath,
                  _id:req.params.id //This is required, or a new ID will be assigned!
                 });
            
     

        if (!errors.isEmpty()) {
            var author1 = await Author.findById(req.params.id)
            
                res.render('author_update_form', { title: 'Update Book',author:author1 ,  errors: errors.array() });
           
        }
        else {
            // Data from form is valid. Update the record.
            Author.findByIdAndUpdate(req.params.id, author, {}, function (err,theauthor) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   res.redirect(theauthor.url);
                });
        }
    }
];