# Todo list with ReactJS, PHP and AJAX

A todo list created with ReactJS where data is pulled from a database using PHP script through AJAX.

![alt tag](https://raw.githubusercontent.com/BriniDesigner/Todo-list/master/screenshot.png)


# How it works?
* When the page is first loaded, data is loaded through AJAX
* Clicking on the Create new button will create a new note to the screen.
* Click on the Edit button will show a form to edit the current item
* Click on the Delete button to delete at item
* If our HTML page sends a GET request the PHP script will return the list of all items
* If the request is a POST we test if the operation is add, edit or delete

# Requirements
* You may need a PHP and MySQL server in order to run the server-side code