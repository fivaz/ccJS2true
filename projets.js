
const iptProject = $("#ipt-project");
const iptUniversity = $("#ipt-university");
const iptNbVotes = $("#ipt-nb-votes");

const btnNextPage = $("#btn-next-page");
const btnPreviousPage = $("#btn-previous-page");

const btnClearFilters = $("#btn-clear-filters");
const btnClearContacts = $("#btn-clear-contacts");

const lstContacts = $("#lst-contacts");

let currentPage = 1;

const url = 'http://localhost:8005/Projets/projets.php';

const contacts = downloadContacts();
refreshContacts();

iptProject.keyup(_ => searchProjects(iptProject.val(), iptUniversity.val(), iptNbVotes.val(), currentPage));
iptUniversity.keyup(_ => searchProjects(iptProject.val(), iptUniversity.val(), iptNbVotes.val(), currentPage));
iptNbVotes.keyup(_ => searchProjects(iptProject.val(), iptUniversity.val(), iptNbVotes.val(), currentPage));

btnNextPage.click(_ => {
	increasePage();
	searchProjects(iptProject.val(), iptUniversity.val(), iptNbVotes.val(), currentPage);
});
btnPreviousPage.click(_ => {
	reducePage();
	searchProjects(iptProject.val(), iptUniversity.val(), iptNbVotes.val(), currentPage);
});

btnClearFilters.click(_ => clearFilters(iptProject, iptUniversity, iptNbVotes, currentPage));

btnClearContacts.click(_ => clearContacts());

function getXML(url) {
	return fetch(url)
		.then(res => res.text())
		.then(text => $.parseXML(text));
}

function searchProjects(project, university, nbVotes, page){
	getXML(url + `?recherche&projet=${project}&universite=${university}&vote=${nbVotes}&page=${page}`)
		.then(projectsXML => populateListOfProjects(projectsXML));
}

function populateListOfProjects(projectsXML){
	projectsXML = $(projectsXML);
	
	nbProjects = projectsXML.find('nombre_total').text();
	$("#nb-projects").text(nbProjects);
	
	const tbProjects = $("#tb-projects");
	tbProjects.empty();
	
	
	//j'utilise onclick="addContact(this)" pour déclencher la fonction addContact quand je clique sur l'adresse email
	//cette façon de faire peut paraître un peu ancienne mais je me suis inspiré d'un Framework très actuel (Angular) qui utilise cette syntaxe. 
	projectsXML
		.find('projet')
		.each((i, p) => { 
			project = $(p);
			const row = 
				`<tr>
					<td>${project.find('index').text()}</td>
					<td>${project.find('nom').text()}</td>
					<td>${project.find('universite').text()}</td>
					<td>${project.find('vote').text()}</td>
					<td>${project.find('responsable_nom').text()} ${project.find('responsable_prenom').text()}</td>
					<td onclick="addContact(this)" class="td-project__email">${project.find('email').text()}</td>
				</tr>`;
			tbProjects.append(row);
		}
	);	
}

function increasePage(){
	currentPage += 1;
}

function reducePage(){
	if(currentPage > 1)
		currentPage -= 1;
}

function clearFilters(iptProject, iptUniversity, iptNbVotes, currentPage){
	iptProject.val("");
	iptUniversity.val("");
	iptNbVotes.val("");
	currentPage = 1;
	searchProjects(iptProject.val(), iptUniversity.val(), iptNbVotes.val(), currentPage);
}

function addContact(tdEmail){
	contact = $(tdEmail).text();
	contacts.push(contact);
	contacts.sort();
	uploadContacts();
	refreshContacts();
}

function uploadContacts(){
	localStorage.setItem("contacts", JSON.stringify(contacts));
}

function downloadContacts(){
	return JSON.parse(localStorage.getItem("contacts")) || [];
}

function refreshContacts(){
	lstContacts.empty();
	const listHTML = contacts.map(contact => `<li>${contact}</li>`).join('');
	lstContacts.html(listHTML);
}

function clearContacts(){
	//Je fais comme ça parce que ma liste est une "constant".
	contacts.length = 0;
	uploadContacts();
	refreshContacts();
}
