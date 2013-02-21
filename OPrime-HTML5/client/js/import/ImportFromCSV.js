window.rows=[];
window.sheets=[];
window.participant ={};

String.prototype.splitCSV = function(sep) {
  for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
      } else if (x) {
        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
      } else foo = foo.shift().split(sep).concat(foo);
    } else foo[x].replace(/""/g, '"');
  } return foo;
};

var importFromCSV = function(filename){
	var output= document.getElementById('data_area');
	var contents = output.innerHTML.split("\n");
	
	if(contents[0].length < contents[1].length){
		return;
	}
	output.innerHTML="";
	
	var header  = contents[0].splitCSV();
	contents.splice(0,1);
	var sheets = window.sheets;
	for(r in contents){
		var rowobj = [];
		var rowcontents = contents[r].splitCSV();
		for (c in rowcontents){
			var obj = {};
			obj.question = header[c];
			obj.response = rowcontents[c];
			rowobj.push(obj);
			
		}
		sheets.push(rowobj);
	}
	showRow(sheets.length-1);
	
	

};
var combineSheets = function(first,second){
	var f = window.sheets[first];
	var s = window.sheets[second];
	window.rows.push(f.concat(s));
	window.sheets.splice(second,1);
	window.sheets.splice(first,1);
	showRow(window.rows.length - 1);
}
var showRow = function(r){
	var output = document.getElementById('question_area');
	output.innerHTML = "";
	var row = window.rows[r];
	if(! row){
		row = window.sheets[r];
	}
	for(c in row){
		var q = document.createElement("div");
		q.innerHTML="<span class='question'>"+row[c].question+"</span> : <span class='response'>"+row[c].response+"</span>";
		output.appendChild(q);
	}
};
var showParticipant = function(){
	var output = document.getElementById('question_area');
	output.innerHTML = "";
	var participant = window.participant;
	var row = participant.data;
	for(c in row){
		if(row[c] != null){
			var q = document.createElement("div");
			q.innerHTML="<span class='participantquestion'>"+c+"</span> : <span class='response'>"+row[c]+"</span>";
			output.appendChild(q);
		}else{
			row[c]="";
		}
	}
	localStorage.setItem("participant",JSON.stringify(participant));
};
var findQuestionsInRow = function(r){
	var output = document.getElementById('question_area');
	output.innerHTML = "";
	var row = window.rows[r];
	var participant = window.participant;
	participant.raw = window.rows[r];
	participant.data = [];
	for(c in row){
		var num = row[c].question.match(/[0-9]*/);
		num = parseInt(num[0]);
		if(num){
			participant.data[num] = row[c].response;
			var q = document.createElement("div");
			q.innerHTML="<span class='participantquestion'>"+row[c].question+"</span> : <span class='response'>"+row[c].response+"</span>";
			output.appendChild(q);
		}
	}
	var x = window.confirm("Are you sure you want replace the current participant with this participant?")
	if (x){
		localStorage.setItem("participant",JSON.stringify(participant));
		
	}	else{
		//window.alert("Not deleteing.")
	}
};

if(localStorage.getItem("participant")){
	window.participant= JSON.parse(localStorage.getItem("participant"));
	showParticipant();
}	
	
/*
 HTML5 Drag and Drop, for more information http://www.html5rocks.com/en/tutorials/file/dndfiles/
 */
	
(function() {
	var APP = this.APP || {};
	var data_area = document.getElementById('data_area');
	if(! data_area){
		return;
	}
	
	console.log("Loading APP file functions.");
	APP.file = {
			readBlob : function (file, opt_startByte, opt_stopByte) {
				//console.log(this);
				var start = parseInt(opt_startByte) || 0;
				var stop = parseInt(opt_stopByte) || file.size - 1;
				var reader = new FileReader();

				// If we use onloadend, we need to check the readyState.
				reader.onloadend = function(evt) {
					if (evt.target.readyState == FileReader.DONE) { // DONE == 2
						document.getElementById('data_area').textContent = evt.target.result;
						document.getElementById('byte_range').textContent = [ '' ]
						.join('');
					}
				};

				if (file.webkitSlice) {
					var blob = file.webkitSlice(start, stop + 1);
				} else if (file.mozSlice) {
					var blob = file.mozSlice(start, stop + 1);
				}
				//reader.readAsBinaryString(blob);
				reader.readAsText(file);
			},
			handleFileSelect: function (evt) {
				//console.log("Handling file select.");
				evt.stopPropagation();
				evt.preventDefault();

				var files = evt.dataTransfer.files; // FileList object.

				// files is a FileList of File objects. List some properties.
				var output = [];
				for ( var i = 0, f; f = files[i]; i++) {
					output.push('<li><strong>', f.name, '</strong> (', f.type
							|| 'n/a', ') - ', f.size,
							' bytes, last modified: ', f.lastModifiedDate
							.toLocaleDateString(), '</li>');
					/*
				Read in the file
					 */
					var startByte = 0;
					var endByte = 512;
					APP.file.readBlob(f, startByte, endByte);
				}
				document.getElementById('list').innerHTML = '<ul>'
					+ output.join('') + '</ul>';
			},
			handleDragOver: function (evt) {
				//console.log(this);
				evt.stopPropagation();
				evt.preventDefault();
				evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
				document.getElementById('question_area').innerHTML="";
			}
	};
	document.body.addEventListener('dragover', APP.file.handleDragOver, false);
	document.body.addEventListener('drop', APP.file.handleFileSelect, false);

}());
