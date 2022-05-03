"use strict"

import Page from "../page.js";
import HtmlTemplate from "./page-studierender-edit.html";

/**
 * Funktionalitäten zum Bearbeiten / Anlegen eines Studierenden
 */
export default class PageStudierenderEdit extends Page {
    /**
     * Konstruktor
     * @param {App} app Instanz der App
     * @param {Integer} editId Instanz des zu bearbeiteten Studierenden
     */
    constructor(app, editId) {
        super(app, HtmlTemplate);
        this._editId = editId;
        this._dataset_studierender = {
            vorname: "",
            nachname: "",
            alter: "",
            matrikelnr: "",
            email: "",
        };

        this._vornameInput = null;
        this._nachnameInput = null;
        this._alterInput = null;
        this._matrikelnrInput = null;
        this._emailInput = null;
    }

    async init() {
        await super.init();

        // Studierenden laden
        if (this._editId) {
            this._url = `/studierender/${this._editId}`;
            this._dataset_studierender = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset_studierender.vorname} ${this._dataset_studierender.nachname}`;
        } else {
            this._url = `/studierender`;
            this._title = "Adresse hinzufügen";
        }

        // Daten des Studieren zw.speichern
        let vorname = this._dataset_studierender.vorname;
        let nachname = this._dataset_studierender.nachname;
        let alter = this._dataset_studierender.alter;
        let matrikelnr = this._dataset_studierender.matrikelnr;
        let email = this._dataset_studierender.email;
        if (email == undefined) {
            email = "";
        }

        // Platzhalter für HTML-Coding ersetzen
        let htmlStudierender = this._mainElement.innerHTML;

        // Daten htmlStudierender hinzufügen (so Daten in den Eingabefeldern anzeigen)
        htmlStudierender = htmlStudierender.replace("$VORNAME$", vorname);
        htmlStudierender = htmlStudierender.replace("$NACHNAME$", nachname);
        htmlStudierender = htmlStudierender.replace("$ALTER$", alter);
        htmlStudierender = htmlStudierender.replace("$MATRIKELNUMMER$", matrikelnr);
        htmlStudierender = htmlStudierender.replace("$EMAIL$", email);
        this._mainElement.innerHTML = htmlStudierender;

        // Event-Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save_studierender");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder merken
        this._vornameInput = this._mainElement.querySelector("input.vorname");
        this._nachnameInput = this._mainElement.querySelector("input.nachname");
        this._alterInput = this._mainElement.querySelector("input.alter");
        this._matrikelnrInput = this._mainElement.querySelector("input.matrikelnr");
        this._emailInput = this._mainElement.querySelector("input.email");
    }

    async _saveAndExit() {
        // Eingabewerte prüfen
        this._dataset_studierender._id = this._editId;
        this._dataset_studierender.vorname = this._vornameInput.value.trim();
        this._dataset_studierender.nachname = this._nachnameInput.value.trim();
        this._dataset_studierender.alter = this._alterInput.value.trim();
        this._dataset_studierender.matrikelnr = this._matrikelnrInput.value.trim();
        this._dataset_studierender.email = this._emailInput.value.trim();

        if (!this._dataset_studierender.vorname) {
            alert("Bitte einen Vornamen eingeben!");
            return;
        }

        if (!this._dataset_studierender.nachname) {
            alert("Bitten einen Nachnamen eingeben!");
            return;
        }

        // Studierender in Datenbank abspeichern
        try {
            if (this._editId) {
                await this._app.backend.fetch("PUT", this._url, {body: this._dataset_studierender});
            } else {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset_studierender});
            }
        } catch(ex) {
            this._app.showException(ex);
            return;
        }

        // zur Gesamtübersicht zurückkehren
        location.hash = "#/";
    }

}