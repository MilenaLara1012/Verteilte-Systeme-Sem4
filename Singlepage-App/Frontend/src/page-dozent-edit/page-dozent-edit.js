"use strict"

import Page from "../page.js";
import HtmlTemplate from "./page-dozent-edit.html";

/**
 * Die Klasse PageEditDozent stellt die Funktionalitäten zum Bearbeiten eines bereits gespeicherten oder zum Anlegen eines neuen Dozenten bereit.
 */
export default class PageEditDozent extends Page {
    /**
     * Konstruktor der Klasse
     * @param {App} app Instanz der App 
     * @param {Integer} editId Instanz des zu bearbeitenden Dozenten
     */
    constructor(app, editId) {
        super(app, HtmlTemplate);

        this._editId = editId;

        this._dataset_dozent = {
            vorname: "",
            nachname: "",
            fakultaet: "",
            status: "",
        };

        this._vornameInput = null;
        this._nachnameInput = null;
        this._fakultaetInput = null;
        this._statusInput = null;
    }

    /**
     * HTML-Inhalt aus "page-dozent-edit.html" nachladen
     */
    async init() {
        await super.init();

        // Dozent laden
        if(this._editId) {
            this._url = `/dozent/${this._editId}`;
            this._dataset_dozent = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset_dozent.vorname} ${this._dataset_dozent.nachname}`;
        } else {
            this._url = `/dozent`;
            this._title = "Adresse hinzufügen";
        }

        // Daten des Dozenten zwischenspeichern
        let vorname = this._dataset_dozent.vorname;
        let nachname = this._dataset_dozent.nachname;
        let fakultaet = this._dataset_dozent.fakultaet;
        let email = this._dataset_dozent.email;
        if(email == undefined) {
            email = "";
        }
        let status = this._dataset_dozent.status;


        // Platzhalter für HTML-Code ersetzen
        let htmlDozent = this._mainElement.innerHTML;
        // Daten dem htmlDozent hinzufügen zum Anzeigen der Daten in Eingabefeldern
        htmlDozent = htmlDozent.replace("$VORNAME$", vorname);
        htmlDozent = htmlDozent.replace("$NACHNAME$", nachname);
        htmlDozent = htmlDozent.replace("$FAKULTAET$", fakultaet);
        htmlDozent = htmlDozent.replace("$EMAIL$", email);
        htmlDozent = htmlDozent.replace("$STATUS$", status);
        this._mainElement.innerHTML = htmlDozent;

        //Event-Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save_dozent");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder merken
        this._vornameInput = this._mainElement.querySelector("input.vorname");
        this._nachnameInput = this._mainElement.querySelector("input.nachname");
        this._fakultaetInput = this._mainElement.querySelector("input.fakultaet");
        this._emailInput = this._mainElement.querySelector("input.email");
        this._statusInput = this._mainElement.querySelector("input.status");
    }

    /**
     * Speichert die Änderungen an einem Dozenten bzw. legt den Datensatz in der DB an
     * Nach Ausführen des Speicherns wird automatisch zur Listenseite gesprungen
     */
    async _saveAndExit() {
        // Eingabewerte prüfen
        this._dataset_dozent._id = this._editId;
        this._dataset_dozent.vorname = this._vornameInput.value.trim();
        this._dataset_dozent.nachname = this._nachnameInput.value.trim();
        this._dataset_dozent.fakultaet = this._fakultaetInput.value.trim();
        this._dataset_dozent.email = this._emailInput.value.trim();
        this._dataset_dozent.status = this._statusInput.value.trim();

        if(this._dataset_dozent.status != "intern" && this._dataset_dozent.status != "extern") {
            alert("Geben Sie als Status bitte entweder die Werte \"intern\" für einen internen Dozenten oder \"extern\" für einen externen Dozenten ein");
            return;
        }

        if(!this._dataset_dozent.vorname) {
            alert("Bitte Vorname eingeben");
            return;
        }
        if(!this._dataset_dozent.nachname) {
            alert("Bitte Nachname eingeben");
            return;
        }
                
        // Dozent in DB speichern
        try {
            if(this._editId) {
                await this._app.backend.fetch("PUT", this._url, {body: this._dataset_dozent});
            } else {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset_dozent});
            }
        } catch(ex) {
            this._app.showException(ex);
            return;
        }

        // Zurück zur Gesamtübersicht
        location.hash = "#/";
    }
}