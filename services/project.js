var db = require('../database/db');
var Project = db.model('Project');
var mongoose = require('mongoose');
var stringSimilarity = require('string-similarity');

var errorMessage = require('./error');
var serviceUser = require('./user');

function findProjectByParameter(parameter, callback){
	Project.find(parameter, function(err, projects){
		if(err){
			var error = new errorMessage('Internal Server Error',500);
			return callback(error);
		}
		if(projects.length == 0){
			var error = new errorMessage('Projects not found', 404);
			return callback(error);
		}
		return callback(null, projects);
	});
}

function findAllProjects(callback){
	findProjectByParameter({}, function(err, projects){
		callback(err, projects);
	});
}

function findProjectByID(id, callback){
	findProjectByParameter({'_id': id}, function(err, project){
		if(err)
			return callback(err, project);
		return callback(err, project[0]);
	});
}

function findProjectsByName(name, callback){
	findProjectByParameter({'name':name}, function(err, projects){
		callback(err, projects);
	});
}

function findProjectsByTheme(name, callback){
	findProjectByParameter({'theme':theme}, function(err, projects){
		callback(err, projects);
	});
}

function findProjectsByCity(city, callback){
	findProjectByParameter({'city':city}, function(err, projects){
		callback(err, projects);
	});
}

function findProjectsByDescription(description, elements, callback){
	var results = [];
	findAllProjects(function(err, projects){
		if(err)
			return callback(err);		

		for (var i = 0; i < projects.length; i++) {
			if(projects[i].description){
				value = stringSimilarity.compareTwoStrings(description, projects[i].description);
				results.push([value, projects[i]]);
			}
		}
		results.sort(sortFunction);
		results = results.slice(0, elements);
		return callback(null, results);
	});

	function sortFunction(a,b){
		return (a[0] > b[0]) ? -1 : 1;
	}
}

function addProject(name, theme, description, city, address, callback){
	var project = new Project({
		_id: mongoose.Types.ObjectId(),
		name: name,
		theme: theme,
		description: description,
		city: city,
		address: address
	});

	project.save(function(err){
		if(err){
			console.log(err);
			var error = new errorMessage('Internal Server Error',500);
			return callback(error);
		}
		callback(null, project._id);
	});
}

function deleteProject(id, callback){
	findProjectByID(id, function(err, project){
		if(err)
			return callback(err);

		project.remove(function(err){
			if(err){
				var error = new errorMessage('Internal Server Error',500);
				return callback(error);
			}
			callback(null, 'Project deleted');
		});
	});
}

function editProject(id, name, theme, description, city, address, callback){
	findProjectByID(id, function(err, project){
		if(err)
			return callback(err);

		project.name = name;
		project.theme = theme;
		project.description = description;
		project.city = city;
		project.address = address;
		project.save(function(err){
			if(err){
				var error = new errorMessage('Internal Server Error',500);
				return callback(error);
			}
			return callback(null, 'Project modified');
		});
	});
}

function addNote(id, title, description, author, modifiable, callback){
	serviceUser.findUserByID(author, function(err, user){
		if(err)
			return callback(err);
		else{
			findProjectByID(id, function(err, project){
				if(err)
					return callback(err);

				var date = new Date();
				var note = {'_id': mongoose.Types.ObjectId(),
							'title':title, 
							'description':description,
							'author':author,
							'modifiable': modifiable,
							'date': date};
				project.notes.push(note);
				project.save(function(err){
					if(err){
						var error = new errorMessage('Internal Server Error',500);
						return callback(error);
					}
					return callback(null, note._id);
				});
			});
		}
	});
}

function deleteNote(idProject, idNote, callback){

	findProjectByID(idProject, function(err, project){
		if(err)
			return callback(err);
		
		var index = project.notes.findIndex(note => note._id == idNote);
		if(index != -1){
			project.notes.remove(idNote);			
			project.save(function(err){
				if(err){
					var error = new errorMessage('Internal Server Error',500);
					return callback(error);
				}
				return callback(null, 'Note deleted');
			});
		}
		else{
			var error = new errorMessage('Note not registered',404);
			return callback(error);
		}
	});
}



module.exports.findAllProjects = findAllProjects;
module.exports.findProjectByID = findProjectByID;
module.exports.findProjectsByName = findProjectsByName;
module.exports.findProjectsByTheme = findProjectsByTheme;
module.exports.findProjectsByCity = findProjectsByCity;
module.exports.findProjectsByDescription = findProjectsByDescription;
module.exports.addProject = addProject;
module.exports.deleteProject = deleteProject;
module.exports.editProject = editProject;
module.exports.addNote = addNote;
module.exports.deleteNote = deleteNote;