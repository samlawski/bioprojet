// ********************* //
// ****** CLASSES ****** //
// ********************* //

// Object List
function ObjectList(name, key){
  this.name = name;
  this.html_parent = document.getElementById(name);

  this.initializeWithKey(key);
  this.getOnceAndAppend();
  this.initializeSaveButton(key);
};
ObjectList.prototype.initializeWithKey = function(key){
  this.database_parent = firebase.database().ref(key);
};
ObjectList.prototype.getOnceAndAppend = function(){
  var object_name = this.name,
      html_parent = this.html_parent;

  this.database_parent.child('product_list').once('value', function(snapshot){
    snapshot.forEach(function(child_s){
      var element = new ListItem(child_s.val(), object_name, child_s.key);

      html_parent.appendChild(element);
    });
  });
};
ObjectList.prototype.initializeSaveButton = function(key){
  document.getElementById('input_submit').onclick = function(){
    firebase.database().ref(key + '/product_list').child(document.getElementById('input_id').value).update({
      name: document.getElementById('input_name').value,
      bild_url: document.getElementById('input_bild').value,
      beschreibung: tinymce.activeEditor.getContent()
    })
  }
};

// Object
function ListItem(item_data, id, parent_key){
  this.element = document.createElement('div');
  // Include content
  this.html_content = document.createTextNode(item_data.name);
  this.element.appendChild(this.html_content);
  // Set ID
  this.element_id = id + "_" + item_data.name.toLowerCase();
  this.element.setAttribute("id", this.element_id);
  // Set onClick EventListener
  this.element.onclick = function() {
    document.getElementById('edit').classList.remove('hidden');
    document.getElementById('edit_name').innerHTML = item_data.name;
    document.getElementById('input_name').value = item_data.name;
    document.getElementById('input_id').value = parent_key;
    document.getElementById('input_bild').value = item_data.bild_url;
    tinymce.activeEditor.setContent(item_data.beschreibung);
  };

  return this.element;
}

window.onload = function(){
  // Firebase authantication
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Toggle views
      document.querySelector('main').classList.remove('hidden');
      document.getElementById('require_login').classList.add('hidden');
      // Get content from firebase
      firebase.database().ref().once("value", function(snap){
        var key = Object.keys(snap.val())[0];

        var list = new ObjectList("list", key);
      });
    } else {
      document.getElementById('require_login').classList.remove('hidden');
      document.querySelector('main').classList.add('hidden');
    }
  });
  // Textarea initialize
  tinymce.init({
    selector:'textarea',
    menubar: false,
    toolbar: "undo redo | bold italic underline | removeformat | alignleft aligncenter alignright bullist numlist outdent indent | link image",
    height: 300,
    plugins: "image link"
  });
  // Listen: Admin access
  document.getElementById('admin_access_submit').onclick = function(){
    var password = document.getElementById('admin_access_pw').value;
    firebase.auth().signInWithEmailAndPassword('admin_access@bioprojet.de', password).then(function(){
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    });
  };
}
