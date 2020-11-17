var express = require("express");
var router = express.Router();


// Require controller modules.
var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var book_instance_controller = require('../controllers/bookInstanceController');

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', async (req,res)=>{
    var libraryDetails=await book_controller.index();
    const details = await JSON.stringify(libraryDetails) 
    var result =JSON.parse(details);
    res.status(200).render("hero.hbs",{
        layout: "main.hbs",
        data: result,
        title: "HomePage"
    })
    
});

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/book/create', book_controller.book_create_get);

// POST request for creating Book.
router.post('/book/create', book_controller.book_create_post);

// GET request to delete Book.
router.get('/book/:id/delete', book_controller.book_delete_get);

// POST request to delete Book.
router.post('/book/:id/delete', book_controller.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', book_controller.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', book_controller.book_update_post);

// GET request for one Book.
router.get('/book/:id', async (req,res)=>{
    var id  = req.params.id;
    
    try{
    var result = await book_controller.book_detailsByBookID(id);
    }
    catch(err)
    {
    console.log(err);
    }
    try{
        if(result!=null)
    var book = await JSON.parse(JSON.stringify(result));
    else
    var book = {};
    }
    catch(err)
    {
        console.log(err);
    }
    try{
    var result1 = await book_instance_controller.bookinstance_detail(id);
    }
    catch(err)
    {
        console.log(err);
    }
    try{
        if(result1!=null)
        {
    var book_Instances = await JSON.parse(JSON.stringify(result1));

        }
    else
    var book_Instances = {};
   
    }
    catch(err)
    {
        console.log(err);
    }
   
        if(book_Instances.length>0)
        {
    for(var i=0;i<book_Instances.length;i++)
   {
       if(book_Instances[i].status=='Available')
       {
           book_Instances[i].Available = true;
           book_Instances[i].Maintenance = false;
           book_Instances[i]. Loaned = false;
       }
       else if(book_Instances[i].status =='Maintenance')
       {
        book_Instances[i].Available =false;
        book_Instances[i].Maintenance = true;
        book_Instances[i]. Loaned = false;
       }
       else
       {
        book_Instances[i].Available =false;
        book_Instances[i].Maintenance = false;
        book_Instances[i]. Loaned = true;
       }
   }
}

    res.status(200).render("book_detail.hbs",{
        layout: "main.hbs",
    data: book,
    bookInstance: book_Instances,
    title: "Book Details Page"
    })

});

// GET request for list of all Book items.
router.get('/books', async (req,res)=>{
   var books =  await  book_controller.book_list();
   var bookList = JSON.parse(JSON.stringify(books));
    
   var bookListArray = Object.values(bookList).map((books)=>{
    fullUrl = books.url+"/delete"
    updateUrl = books.url+"/update"
      return{...books, fullUrl,updateUrl}
   })
   
  
      res.status(200).render("bookList.hbs",{
    layout: "main.hbs",
    data: bookListArray,
    title: "BookListPage"
   })
})
/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author.
router.post('/author/create', author_controller.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/author/:id', async (req,res)=>{
    var id = req.params.id;
    try{
    var result = await author_controller.author_detail(id);
    }
    catch(err)
    {
        console.log(err);
    }
    try{
    var authorDetails = await JSON.parse(JSON.stringify(result));
    authorDetails.fullUrl = authorDetails.url+ "/delete";
    authorDetails.updateUrl = authorDetails.url+"/update"
   
    }
    catch(err)
    {
        console.log(err);
    }
        try{
    var result1 = await book_controller.book_detailsByAuthorId(id) 
        }
        catch(err)
        {
        console.log(err);
        }
            try{
       var bookDetails=  await JSON.parse(JSON.stringify(result1));
            }
            catch(err)
            {
                console.log(err)
            }
            res.status(200).render("author_detail.hbs",{
                layout:"main.hbs",
        title:"AuthorDetails Page",
        author: authorDetails,
        author_books: bookDetails
            })

});

// GET request for list of all Authors.
router.get('/authors', async (req,res)=>{

    var result = await author_controller.author_list();
    var authors = await JSON.parse(JSON.stringify(result))
        
    
    res.status(200).render("author_list.hbs",{
        layout:"main.hbs",
        title:"AuthorList Page",
        data:authors
    })
});

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update',  genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', async (req,res)=>{
    var id = req.params.id
    
    try{
    var result1 = await genre_controller.genre_detail(id);
    }
    catch(error)
    {
    console.log(error);
    }
    try
    {
    var genre = await JSON.parse(JSON.stringify(result1));
    }
    catch(error)
    {
        console.log(error)
    }
    try{
   var result =  await book_controller.book_detail(id);
    }
    catch(error)
    {
        console.log(error)
    }

try{
    if(result!=null)
    {
    var book = await JSON.parse(JSON.stringify(result));
    
    }
    else
    {
    var book = {};
  
    }

}
catch(err)
{
    console.log(err);
}
   
        

   res.render("genre_detail.hbs",{
    layout:"main.hbs",
    title:"genre Details Page",
    data: book,
    genre:genre
})


});

// GET request for list of all Genre.
router.get('/genres', async (req,res)=>{
    var result = await genre_controller.genre_list ();
    var genres = await JSON.parse(JSON.stringify(result))
    var genres1 = Object.values(genres).map((genere)=>{
       var fullUrl = genere.url+'/delete'
       var updateUrl = genere.url+'/update'
       return {...genere,fullUrl,updateUrl}
    })
    
    res.status(200).render("genre_list.hbs",{
        layout:"main.hbs",
        title:"Genre Details",
        data:genres1
    })
});

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

// POST request for creating BookInstance. 
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

// GET request to delete BookInstance.
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

// POST request to delete BookInstance.
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

// GET request to update BookInstance.
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

// POST request to update BookInstance.
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

// GET request for one BookInstance.
router.get('/bookinstance/:id',async (req,res)=>{
    var id = req.params.id
    try{
    var result = await book_instance_controller.bookinstance_details_byInstanceId(id);
    }
    catch(err)
    {
        console.log(err);
    }
    try{
        if(result!=null)
        {
        var bookInstances = await JSON.parse(JSON.stringify(result));

       
            if(bookInstances.status=='Available')
            {
                bookInstances.Available = true;
                bookInstances.Maintenance = false;
                bookInstances. Loaned = false;
            }
            else if(bookInstances.status =='Maintenance')
            {
             bookInstances.Available =false;
             bookInstances.Maintenance = true;
             bookInstances. Loaned = false;
            }
            else
            {
             bookInstances.Available =false;
             bookInstances.Maintenance = false;
             bookInstances. Loaned = true;
            }
        
       
        }

        else
        var bookInstances ={};
        bookInstances.isEmpty = true
    }
    catch(err)
    {
        console.log(err);
    }
    res.status(200).render("bookinstance_detail.hbs",{
        layout:"main.hbs",
        title:"bookInstance Details",
        instanceDetails:bookInstances
    })
});

// GET request for list of all BookInstance.
router.get('/bookinstances', async (req,res)=>{
   const result = await book_instance_controller.bookinstance_list();
   const bookInstances = await JSON.parse(JSON.stringify(result));
   for(var i=0;i<bookInstances.length;i++)
   {
       var fullUrl = bookInstances[i].url+"/delete"
       var updateUrl = bookInstances[i].url+"/update"
       if(bookInstances[i].status=='Available')
       {
           bookInstances[i].Available = true;
           bookInstances[i].Maintenance = false;
           bookInstances[i]. Loaned = false;
            bookInstances[i].fullUrl = fullUrl
            bookInstances[i].updateUrl = updateUrl
       }
       else if(bookInstances[i].status =='Maintenance')
       {
        bookInstances[i].Available =false;
        bookInstances[i].Maintenance = true;
        bookInstances[i]. Loaned = false;
        bookInstances[i].fullUrl = fullUrl
        bookInstances[i].updateUrl = updateUrl
       }
       else
       {
        bookInstances[i].Available =false;
        bookInstances[i].Maintenance = false;
        bookInstances[i]. Loaned = true;
        bookInstances[i].fullUrl = fullUrl
        bookInstances[i].updateUrl = updateUrl
       }
   }

   res.status(200).render("bookinstance_list.hbs",{
       layout:"main.hbs",
       title:"bookInstance Page",
       data:bookInstances
   })
});

module.exports = router;