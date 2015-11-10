<?php 

// Database Config
define ( 'DB_HOST', 'localhost' );
define ( 'DB_USER', 'root' );
define ( 'DB_PASSWORD', '' );
define ( 'DB_DB', 'todo' );


// The Note Class
class Note {

	private static $conn;

	public static function query($sql){
		// Connect to the database
		self::$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DB);
		// Execute query
		$res = self::$conn->query($sql);
		return $res;
	}

	public static function closeConnection() {
		self::$conn->close();
	}

	public static function getAll(){
		$res = self::query("SELECT * FROM notes");
		$res = $res->fetch_all(MYSQLI_ASSOC);
		return json_encode($res);
	}

	public static function save($note){

		$title = $note['title'];
		$message = $note['message'];

		if (empty($note['id'])) {
			// Add a new note
			$res = self::query("INSERT INTO `notes` (`id`, `title`, `message`) VALUES (NULL, '{$title}', '{$message}')");
			$res = self::$conn->insert_id;
		} else {
			// Update an existing note
			$id = $note['id'];
			$res = self::query("UPDATE `notes` SET `title` = '{$title}', `message` = '{$message}' WHERE `notes`.`id` = {$id}");
		}
		// Return query result
		return json_encode($res);
	}

	public static function delete($id){
		$res = self::query("DELETE FROM notes WHERE `id` = {$id}");
		return $res;
	}

}

// Our script requires JSON data format
// Set Content-Type to JSON
header('Content-Type: application/json');

// if GET request then return the list of all items
// if POST request then add, edit or delete
switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		echo Note::getAll();
		break;
	
	case 'POST':
		if (isset($_POST['action'])) {
			echo Note::delete($_POST['id']);
		} else {
			print_r( Note::save($_POST) );
		}
		break;

	default:
		echo 'Unknown operation';
		break;
}
?>