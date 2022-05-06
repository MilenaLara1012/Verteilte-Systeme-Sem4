"use strict"

import Page from "../page.js";
import HtmlTemplate from "./page-kurs-edit.html";

/**
 * Funktionalitäten zum Bearbeiten / Anlegen eines Kurs
 */
export default class PageKursEdit extends Page {
    /**
     * Konstruktor
     * @param {App} app Instanz der App
     * @param {Integer} editId Instanz des zu bearbeiteten Kurs
     */
    constructor(app, editId) {
        super(app, HtmlTemplate);
        this._editId = editId;
        this._dataset_kurs = {
            name: "",
            pruefungsform: "",
            ects: 0,

        };

        this._nameInput = null;
        this._pruefungsformInput = null;
        this._ectsInput = null;
    }

    async init() {
        await super.init();

        // Kurse laden
        if (this._editId) {
            this._url = `/kurse/${this._editId}`;
            this._dataset_kurs = await this._app.backend.fetch("GET", this._url);
            this._title = `${this._dataset_kurs.name}`;
        } else {
            this._url = `/kurse`;
            this._title = "Kurs hinzufügen";
        }

        // temp
        let name = this._dataset_kurs.name;
        let pruefungsform = parseInt(this._dataset_kurs.pruefungsform);
        let ects = this._dataset_kurs.ects;


        // Platzhalter für HTML-Coding ersetzen
        let htmlKurs = this._mainElement.innerHTML;

        // Daten in HTML einfügen
        htmlKurs = htmlKurs.replace("$TITEL$", name).replace("$PRUEFUNGSFORM$", pruefungsform).replace("$ECTS$", ects);
        this._mainElement.innerHTML = htmlKurs;

        // Event-Listener registrieren
        let saveButton = this._mainElement.querySelector(".action.save_kurs");
        saveButton.addEventListener("click", () => this._saveAndExit());

        // Eingabefelder merken
        this._nameInput = this._mainElement.querySelector("input.name");
        this._pruefungsformInput = this._mainElement.querySelector("input.pruefungsform");
        this._ectsInput = this._mainElement.querySelector("input.ects");
    }

    async _saveAndExit() {
        // Eingabewerte prüfen
        this._dataset_kurs._id = this._editId;
        this._dataset_kurs.name = this._nameInput.value.trim();
        this._dataset_kurs.pruefungsform = this._pruefungsformInput.value.trim();
        this._dataset_kurs.ects = parseInt(this._ectsInput.value);

        if (!this._dataset_kurs.name) {
            alert("Bitte einen Namen eingeben!");
            return;
        }

        // Kurs in Datenbank abspeichern
        try {
            if (this._editId) {
                await this._app.backend.fetch("PUT", this._url, {body: this._dataset_kurs});
            } else {
                await this._app.backend.fetch("POST", this._url, {body: this._dataset_kurs});
            }
        } catch(ex) {
            this._app.showException(ex);
            return;
        }

        // zur Gesamtübersicht zurückkehren
        location.hash = "#/";
    }

}