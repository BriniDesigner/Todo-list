var Note = React.createClass({
	getInitialState: function(){
		// Initial State is set to false
		return { editing: false };
	},
	edit: function(){
		// Once we click on the Edit button we need to set the editing state to true
		this.setState({ editing: true });
	},
	save: function(){
		// Get the new values from the form
		var newTitle = this.refs.newTitle.getDOMNode().value;
		var newMessage = this.refs.newMessage.getDOMNode().value;
		var id = this.refs.id.getDOMNode().value;
		// Create a new JSON object
		var newNote = {id: id, title: newTitle, message: newMessage};
		// Send data via AJAX using POST
		$.post( "todo.php", newNote, function( data ) {
		  console.log( data );
		  this.props.id = data;
		  console.log(this.props.id);
		}.bind(this));
		// Update notes
		this.props.onChange(newNote, this.props.index);
		this.setState({ editing:false });
	},
	remove: function(){
		// Get the element ID
		var id = this.refs.id.getDOMNode().value;
		// Send AJAX request to delete the current item
		$.ajax({
		  type: "POST",
		  url: "todo.php",
		  data: {id: id, action: 'delete'},
		  success: function(result){
		  	console.log(result);
		  },
		});
		// Remove the note
		this.props.onRemove(this.props.index);
	},
	renderDisplay: function(){
		return (
			<div className="panel panel-default">
			  <div className="panel-body">
			    <h3>{this.props.title}</h3>
			    <p>{this.props.message}</p>
			    <input type="hidden" ref="id" value={this.props.id} />
			    <p><button className="btn btn-warning" onClick={this.edit}>Edit</button>
			       <button className="btn btn-danger" onClick={this.remove}>Delete</button>
			    </p>
			  </div>
			</div>
			);
	},
	renderForm: function() {
		return (
			<div className="panel panel-default panel-editing">
			  <div className="panel-body">
			  	<input type="hidden" ref="id" value={this.props.id} />
			    <h3><input ref="newTitle" type="text" className="form-control" defaultValue={this.props.title} /></h3>
				<p><textarea ref="newMessage" defaultValue={this.props.message} className="form-control"></textarea></p>
				<button onClick={this.save} className="btn btn-success btn-small glyphicon glyphicon-floppy-disk" />
			  </div>
			</div>
			);
	},
	render: function(){
		if(this.state.editing) {
			// If we are editing then show the form
			return this.renderForm();
		} else {
			// Otherwise render the element
			return this.renderDisplay();
		}
	}
});

// The Board Component regroups a list of notes
var Board = React.createClass({
	getInitialState: function(){
		return {
            notes: []
        };
	},
	componentDidMount: function(){
		// Get all notes from the server
		$.get("todo.php", function(data) {
			if(this.isMounted()){
				this.setState({notes:data});
			}
		}.bind(this));
	},
	add: function(newNote) {
		// Add a new note to the array
        var notes = this.state.notes;
        notes.splice(0, 0, {
            title: newNote.title,
            message: newNote.message
        });
        this.setState({notes: notes});
    },
	update: function(newNote, i){
		// Update the array
		var notes = this.state.notes;
		notes[i] = newNote;
		this.setState({notes:notes});
	},
	remove: function(i){
		// Remove note[i] from the array
		var notes = this.state.notes;
		notes.splice(i, 1);
		this.setState({notes:notes});
	},
	eachNote: function(note, i) {
		return (
			<Note key={i} id={note.id} title={note.title} message={note.message}
				  index={i} onChange={this.update} onRemove={this.remove} />
			);
	},
	render: function(){
		return (
			<div>
				<p><button className="btn btn-lg btn-success"
                        onClick={this.add.bind(null, {title:'add title', message:'...'})}>Create New</button>
                        </p>
				{this.state.notes.map(this.eachNote)}
			</div>
			);
	}
});

React.render(
	<Board />,
	document.getElementById('container')
);