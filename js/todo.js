var Note = React.createClass({
	getInitialState: function(){
		return { editing:false };
	},
	edit: function(){
		this.setState({ editing:true });
	},
	save: function(){
		var newTitle = this.refs.newTitle.getDOMNode().value;
		var newMessage = this.refs.newMessage.getDOMNode().value;
		var id = this.refs.id.getDOMNode().value;
		var newNote = {id: id, title: newTitle, message: newMessage};
		$.ajax({
		  type: "POST",
		  url: "todo.php",
		  data: newNote,
		  success: function(result){
		  	console.log(result);
		  },
		});
		this.props.onChange(newNote, this.props.index);
		this.setState({ editing:false });
	},
	remove: function(){
		var id = this.refs.id.getDOMNode().value;
		$.ajax({
		  type: "POST",
		  url: "todo.php",
		  data: {id: id, action: 'delete'},
		  success: function(result){
		  	console.log(result);
		  },
		});
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
			return this.renderForm();
		} else {
			return this.renderDisplay();
		}
	}
});

var Board = React.createClass({
	getInitialState: function(){
		return {
            notes: []
        };
	},
	componentDidMount: function(){
		$.get("todo.php", function(data) {
			if(this.isMounted()){
				this.setState({notes:data});
			}
		}.bind(this));
	},
	add: function(newNote) {
        var notes = this.state.notes;
        notes.splice(0, 0, {
            title: newNote.title,
            message: newNote.message
        });
        this.setState({notes: notes});
    },
	update: function(newNote, i){
		var notes = this.state.notes;
		notes[i] = newNote;
		this.setState({notes:notes});
	},
	remove: function(i){
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
                        onClick={this.add.bind(null, {title:'add title', message:'...'})}>Create new</button>
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