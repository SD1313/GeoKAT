// ==UserScript==
// @name            GeoKAT Bayern Autologin
// @namespace       https://sd1313.myds.me/greasemonkey
// @version         1.6.1701281210
// @author          Stefan Dorn
// @contributor     UG-ÖEL Bamberg Land
// @description     Automatic log in for the service "GeoKAT".
// @description:de  Loggt sich automatisch beim Dienst "GeoKAT" ein.
// @homepage        https://sd1313.myds.me
// @icon            https://geokat.bayern.de/geokat/images/blaulicht_32.png
// @supportURL      https://sd1313.myds.me
// @match           https://geokat.bayern.de/geokat/login
// @match           https://geokat.bayern.de/geokat/login?*
// @exclude         https://geokat.bayern.de/geokat/login?*&rememberPassword*
// @exclude         https://geokat.bayern.de/geokat/login?rememberPassword*
// @run-at          document-end
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @noframes
// ==/UserScript==

// START_CHANGE_LOG
//
// --- version 1.6
//  added: lock custom-buttons after click
//  added: show version of script on site
//
// --- version 1.5
// removed: auto-submit of form -> logoff is working
//
// --- version 1.4
// changed: script tested with live account
// added: output to console (Ctrl+Shift+J on Firefox)
// added: grant GM_deleteValue
//
// --- version 1.3
// changed: email and passwort stored localy
//
// --- version 1.2
// added: encrypt email & password
// added: set alert if username oder password is missing
// added: support for auto-install
//
// --- version 1.1
// bugfix: forms with disabled=true doesn't work
// added: error handling if site send "feedbackPanelError"
//
// --- version 1.0
// initial version
//
// END_OF_CHANGELOG

// Variablen deklarieren
var Version = '1.6.1701281210';
var Zeitpunkt = new Date();
console.log('Skript gestartet: '+Zeitpunkt.toLocaleString());
var UsernameOK;
var PasswortOK;

// Formular
var LoginCard = document.getElementById('login-card');
var LoginForm = document.getElementsByClassName('form-signin')[0];
var UserName = document.getElementById('inputEmail');
var Password = document.getElementById('inputPassword');
var PwForgot = LoginForm.getElementsByClassName('password-forgot')[0];
var NewAdditionalBtn = document.createElement('button');
var NewAdditionalDiv = document.createElement('span');

// Funktionen
function checkData()
{
  if ( GM_getValue('Username') != '' && GM_getValue('Username') != undefined) {
    UsernameOK = true;
  }
  else {
    UsernameOK = false;
  }
  if ( GM_getValue('Password') != '' && GM_getValue('Password') != undefined) {
    PasswordOK = true;
  }
  else {
    PasswordOK = false;
  }
  console.log('UsernameOK: '+UsernameOK+' PasswordOK: '+PasswordOK);
}

function saveData()
{
  if ( UserName.value != '' && Password.value != '' )
  {
    AdditionalBtn.disabled = true;
    AdditionalBtn.childNodes[0].nodeValue = '...bitte warten...';
    LoginForm.submit();
    GM_setValue('Username',UserName.value);
    GM_setValue('Password',Password.value);
    console.log('Benutzername und Passwort wurden gespeichert.');
  }
}

function deleteData()
{
  AdditionalBtn.disabled = true;
  AdditionalBtn.childNodes[0].nodeValue = '...bitte warten...';
  GM_deleteValue('Username');
  GM_deleteValue('Password');
  UserName.value = '';
  Password.value = '';
  console.log('Benutzername und Passwort wurden gelöscht.');
  document.location.reload();
}

var ErrorObj = document.getElementsByClassName('feedbackPanelERROR');
var i;
var Exist = 0;

for (i = 0; i < ErrorObj.length; i++) {
  Exist = Exist + 1;
}

checkData();
if ( Exist == 0 )
{
  if ( UsernameOK == true && PasswordOK == true )
  {
    // E-Mail-Feld
    UserName.value = unescape(GM_getValue('Username'));
    UserName.style.display = 'none';

    // Passwort-Feld
    Password.value = unescape(GM_getValue('Password'));
    Password.style.display = 'none';

    // Passwort vergessen-Link
    PwForgot.style.display = 'none';

    // Daten löschen-Button
    var AdditionalBtnValue = document.createTextNode('Daten löschen');
    NewAdditionalBtn.appendChild(AdditionalBtnValue);
    NewAdditionalBtn.className = 'btn btn-lg btn-block';
    NewAdditionalBtn.type = 'button';
    NewAdditionalBtn.id = 'AdditionalBtn';
    NewAdditionalBtn.addEventListener('click', deleteData, false);
    LoginForm.appendChild (NewAdditionalBtn);

    }
  else
  {

    // Daten speichern-Button
    var AdditionalBtnValue = document.createTextNode('Anmelden & Daten speichern');
    NewAdditionalBtn.appendChild(AdditionalBtnValue);
    NewAdditionalBtn.className = 'btn btn-lg btn-primary btn-block';
    NewAdditionalBtn.type = 'submit';
    NewAdditionalBtn.id = 'AdditionalBtn';
    NewAdditionalBtn.addEventListener('click', saveData, false);
    LoginForm.appendChild (NewAdditionalBtn);
  }
  var NewText = document.createTextNode('Scriptversion: ' + Version );
  NewAdditionalDiv.appendChild(NewText);
  NewAdditionalDiv.style = 'font-size:0.8em;';
  LoginCard.appendChild (NewAdditionalDiv);
}
else
{
 console.log('Bedingungen für Script Ausführung nicht erfüllt! Starte Löschroutine');
 deleteData();
}