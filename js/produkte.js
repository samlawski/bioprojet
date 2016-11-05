// Initialize Firebase
var config = {
  apiKey: "AIzaSyBlqels-GUR3vVCerItjATd5B24r4IN_dg",
  authDomain: "bioprojet-45ecf.firebaseapp.com",
  databaseURL: "https://bioprojet-45ecf.firebaseio.com",
  storageBucket: "bioprojet-45ecf.appspot.com",
  messagingSenderId: "511400272750"
};
firebase.initializeApp(config);

// Check if parameter from DocCheck exist
if(typeof getUrlParameter('key') != "undefined"){
  sessionStorage.doccheck_key = getUrlParameter("key");
  window.history.replaceState('produkte-login', 'Produkte', '/produkte');
}

// Append DocCheck login form
function appendLoginForm(){
  $('#produkte-login').html(
    '<div class="text-center">' +
      '<div class="lead">Die folgenden Inhalte sind nur für Ärzte und Apotheker zugänglich. Bitte loggen Sie sich ein und/oder klicken Sie auf "Weiter", um die Inhalte sehen zu können.</div>' +
      '<iframe align="center" frameborder="0" scrolling="no" width="311" height="188" name="dc_login_iframe" id="dc_login_iframe" src="https://login.doccheck.com/code/de/2000000009691/m_red/" ><a href="https://login.doccheck.com/code/de/2000000009691/m_red/" target="_blank">LOGIN</a></iframe>' +
    '</div>'
  );
}

// Check if doccheck_key already exists in session storage
if(sessionStorage.doccheck_key && sessionStorage.doccheck_key.length > 0){
  // Get "Produkte" form Firebase using the doccheck_key as a path
  firebase.database().ref(sessionStorage.doccheck_key + '/produkte').once('value', function(snapshot){
    if(snapshot.val()){
      snapshot.forEach(function(child){
        // Append Tab select
        $('#produkte-login .product-select').append(
          '<li role="presentation" class="col-xs-4 text-center">' +
            '<a class="thick" href="#medikament-' + child.val().name + '" aria-controls="medikament-' + child.val().name + '" role="tab" data-toggle="tab">' +
              '<img src="' + child.val().bild_url + '" class="img-responsive" alt="' + child.val().name + ' Verpackung" />' +
              child.val().name +
            '</a>' +
          '</li>'
        );
        // Append Tab body
        $('#produkte-login .tab-content').append(
          '<div role="tabpanel" class="tab-pane" id="medikament-' + child.val().name + '">' +
            '<h1>' + child.val().name + '®</h1>' +
            '<p>' + child.val().beschreibung + '</p>' +
          '</div>'
        );
      }); // / foreach
      $('#produkte-login li').first().addClass('active');
      $('#produkte-login .tab-pane').first().addClass('active');
    }else{
      appendLoginForm();
    }
  });
}else{
  appendLoginForm();
}
