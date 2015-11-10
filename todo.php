<?php 

// Database Config
define ( 'DB_HOST', 'localhost' );
define ( 'DB_USER', 'root' );
define ( 'DB_PASSWORD', '' );
define ( 'DB_DB', 'todo' );

class Note {

	private static $conn;

	public static function query($sql){
		self::$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_DB);
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
			$res = self::query("INSERT INTO `notes` (`id`, `title`, `message`) VALUES (NULL, '{$title}', '{$message}')");
			$res = self::$conn->insert_id;
		} else {
			$id = $note['id'];
			$res = self::query("UPDATE `notes` SET `title` = '{$title}', `message` = '{$message}' WHERE `notes`.`id` = {$id}");
		}
		return json_encode($res);
	}

	public static function delete($id){
		$res = self::query("DELETE FROM notes WHERE `id` = {$id}");
		return $res;
	}

}

// Set Content-Type to JSON
header('Content-Type: application/json');

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
		die('Denied access');
		break;
}
?>