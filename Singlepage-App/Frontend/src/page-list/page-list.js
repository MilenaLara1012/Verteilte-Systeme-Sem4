"use strict";

import Page from "../page.js";
import HtmlTemplate from "./page-list.html";

/**
 * Klasse PageList: Stellt die Listenübersicht zur Verfügung
 */
export default class PageList extends Page {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     */
    constructor(app) {
        super(app, HtmlTemplate);

        this._emptyMessageElement = null;
    }

    /**
     * HTML-Inhalt und anzuzeigende Daten laden.
     *
     * HINWEIS: Durch die geerbte init()-Methode wird `this._mainElement` mit
     * dem <main>-Element aus der nachgeladenen HTML-Datei versorgt. Dieses
     * Element wird dann auch von der App-Klasse verwendet, um die Seite
     * anzuzeigen. Hier muss daher einfach mit dem üblichen DOM-Methoden
     * `this._mainElement` nachbearbeitet werden, um die angezeigten Inhalte
     * zu beeinflussen.
     */
    async init() {
        // HTML-Inhalt nachladen
        await super.init();
        this._title = "Übersicht";

        let data_dozent = await this._app.backend.fetch("GET", "/dozent");
        this._emptyMessageElement = this._mainElement.querySelector(".empty-placeholder");

        if(data_dozent.length) {
            this._emptyMessageElement.classList.add("hidden");
        }

        let olDozentElement = this._mainElement.querySelector("ol");

        let templateDozentElement = this._mainElement.querySelector(".list-dozent-entry");
        let templateDozentHtml = templateDozentElement.outerHTML;
        templateDozentElement.remove();

        for(let index in data_dozent) {
            // Platzhalter ersetzen
            let dataset_dozent = data_dozent[index];
            let htmlDozent = templateDozentHtml;

            // Daten des Dozenten zwischenspeichern
            let _id = dataset_dozent._id;
            let vorname = dataset_dozent.vorname;
            let nachname = dataset_dozent.nachname;
            let fakultaet = dataset_dozent.fakultaet;
            let email = dataset_dozent.email;
            let status = dataset_dozent.status;
            let intern_text = "Interner Dozent";
            let extern_text = "Externer Dozent";

            // Daten dem htmlDozent hinzufügen zum Anzeigen der Daten
            htmlDozent = htmlDozent.replace("$ID$", _id);
            htmlDozent = htmlDozent.replace("$VORNAME$", vorname);
            htmlDozent = htmlDozent.replace("$NACHNAME$", nachname);
            htmlDozent = htmlDozent.replace("$FAKULTAET$", fakultaet);
            htmlDozent = htmlDozent.replace("$EMAIL$", email);

            // Prüfen ob Dozent intern oder extern beschäftigt ist
            if(status == 'intern') {
                htmlDozent = htmlDozent.replace("$STATUS$", intern_text);
            } else if(status == 'extern') {
                htmlDozent = htmlDozent.replace("$STATUS$", extern_text);
            }

            // Dozenten-Element in die Liste einfügen
            let dummyDozentElement = document.createElement("div");
            dummyDozentElement.innerHTML = htmlDozent;
            let liDozentElement = dummyDozentElement.firstElementChild;
            liDozentElement.remove();
            olDozentElement.appendChild(liDozentElement);

            //// TODO: Neue Methoden für Event Handler anlegen und hier registrieren ////
            liDozentElement.querySelector(".action.edit_dozent").addEventListener("click", () => location.hash = `#/editDozent/${dataset_dozent._id}`);
            liDozentElement.querySelector(".action.delete_dozent").addEventListener("click", () => this._askDelete(dataset_dozent._id));
        }
        
    }

    /**
     * Hilfsmethode. Zeigt Fenster mit Sicherheitsabfrage an, ob ein Datensatz wirklich gelöscht werden soll.
     * @param {*} id 
     * @returns 
     */
    async _askDelete(id) {
        // Sicherheitsfrage anzeigen
        let answer = confirm("Soll dieser Dozent wirklich gelöscht werden?");

        if(!answer) {
            return;
        }

        // Dozent löschen
        try {
            this._app.backend.fetch("DELETE", `/dozent/${id}`);
        } catch(ex) {
            this._app.showException(ex);
            return;
        }

        // Dozent aus Liste entfernen
        this._mainElement.querySelector(`[data-id="${id}"]`)?.remove();

        if(this._mainElement.querySelector("[data-id]")) {
            this._emptyMessageElement.classList.add("hidden");
        } else {
            this._emptyMessageElement.classList.remove("hidden");
        }
    }
};
