var jwt = require('jsonwebtoken');

module.exports = function(app){
	
	var serviceMatProjectList = require('../services/matProjectList');
	var sendResponse = require('./sendResponse');

    var findAllMatProjectList = function(req, res){
        serviceMatProjectList.findAllMatProjectList(function (err, matProjectList) {
            sendResponse.sendRes(res, err, matProjectList);
        });
	};

    var findMaterialsOfProjectWithID = function(req, res){
        serviceMatProjectList.findMaterialsOfProjectWithID(req.params._id,
			function (err, project) {
            	sendResponse.sendRes(res, err, project);
        });
	};

    var addMatProjectList = function(req,res){
		serviceMatProjectList.addMatProjectList(req.body.project_id, function(err, id) {
			sendResponse.sendRes(res, err, id);
		});
	};

	var addMaterialNeedList = function(req,res){
		serviceMatProjectList.addMaterialNeedList(req.params._id, req.body.material_id,
			req.body.urgent, function(err) {
				sendResponse.sendRes(res, err, 'Material Added to NeedList');
		});
	};

	var addMaterialInventari = function(req,res){
        serviceMatProjectList.addMaterialInventari(req.params._id, req.body.material_id,
            function(err) {
                sendResponse.sendRes(res, err, 'Material Added to Inventari');
            });
	};

	var editMatProjectList = function(req, res) {
		serviceMatProjectList.editMatProjectList(req.params._id, req.body.project_id, function(err) {
            sendResponse.sendRes(res, err, 'Material Project List modified');
		});
	};

	var deleteMatProjectList = function(req, res){
		serviceMatProjectList.deleteMatProjectList(req.params._id, function(err) {
			sendResponse.sendRes(res, err, "Material Project List Deleted");
		});
	};

	var deleteAllMaterialProjectLists = function(req,res){
        serviceMatProjectList.deleteAllMaterialProjectLists(req.params.sure, function(err) {
            sendResponse.sendRes(res, err, "Material Project List Deleted");
        });
	};

	var deleteMaterialNeedList = function(req,res){
        serviceMatProjectList.deleteMaterialNeedList(req.params._id, req.body.material_id,
            req.body.urgent, function(err) {
                sendResponse.sendRes(res, err, 'Material Deleted from NeedList');
            });
	};

	var deleteMaterialInventari = function(req,res){
        serviceMatProjectList.deleteMaterialInventari(req.params._id, req.body.material_id,
            function(err) {
                sendResponse.sendRes(res, err, 'Material Deleted from Inventari');
            });
	};

    var getUrgentNeedList = function(req, res){
        serviceMatProjectList.getUrgentNeedList(req.params._id, function (err, urgentNeedList) {
            sendResponse.sendRes(res, err, urgentNeedList);
        });
    };

    var getNeedList = function(req, res){
        serviceMatProjectList.getNeedList(req.params._id, function (err, needList) {
            sendResponse.sendRes(res, err, needList);
        });
    };

    var getInventari = function(req, res){
        serviceMatProjectList.getInventari(req.params._id, function (err, inventari) {
            sendResponse.sendRes(res, err, inventari);
        });
    };

	app.get('/matProjectList/findAllLists', findAllMatProjectList);

    app.get('/matProjectList/findMaterialsOfProjectWithID/:_id', findMaterialsOfProjectWithID);

    app.get('/matProjectList/getUrgentNeedLists/:_id', getUrgentNeedList);

    app.get('/matProjectList/getNeedLists/:_id', getNeedList);

    app.get('/matProjectList/getInventari/:_id', getInventari);

	//app.post('/matProjectList/add', addMatProjectList);

	app.put('/matProjectList/addMaterialNeedList/:_id', addMaterialNeedList);

	app.put('/matProjectList/addMaterialInventari/:_id', addMaterialInventari);

	//app.put('/matProjectList/edit/:_id', editMatProjectList);

	//app.delete('/matProjectList/delete/:_id', deleteMatProjectList);

	app.delete('/matProjectList/deleteAll/:sure', deleteAllMaterialProjectLists);

	app.put('/matProjectList/deleteMaterialNeedList/:_id', deleteMaterialNeedList);

	app.put('/matProjectList/deleteMaterialInventari/:_id', deleteMaterialInventari);

};