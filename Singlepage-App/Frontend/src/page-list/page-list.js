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

        let data_studierender = await this._app.backend.fetch("GET", "/studierender");
        this._emptyMessageElement = this._mainElement.querySelector(".empty-placeholder");

        if(data_studierender.length) {
            this._emptyMessageElement.classList.add("hidden");
        }

        let olStudierenderElement = this._mainElement.querySelector("ol");

        let templateStudierenderElement = this._mainElement.querySelector(".list-studierender-entry");
        let templateStudierenderHtml = templateStudierenderElement.outerHTML;
        templateStudierenderElement.remove();

        for(let index in data_studierender) {
            // Platzhalter ersetzen
            let dataset_studierender = data_studierender[index];
            let htmlStudierender = templateStudierenderHtml;

            // Daten einens Studierenden zw.speichern
            let _id = dataset_studierender._id;
            let vorname = dataset_studierender.vorname;
            let nachname = dataset_studierender.nachname;
            let alter = dataset_studierender.alter;
            let email = dataset_studierender.email;
            let matrikelnr = dataset_studierender.matrikelnr;

            // Daten dem htmlStudierender hinzufügen zum Anzeigen der Daten
            htmlStudierender = htmlStudierender.replace("$ID$", _id);
            htmlStudierender = htmlStudierender.replace("$VORNAME$", vorname);
            htmlStudierender = htmlStudierender.replace("$NACHNAME$", nachname);
            htmlStudierender = htmlStudierender.replace("$ALTER$", fakultaet);
            htmlStudierender = htmlStudierender.replace("$EMAIL$", email);
            htmlStudierender = htmlStudierender.replace("$MATRIKELNR$", matrikelnr);

            // Studierender-Element in die Liste einfügen
            let dummyStudierenderElement = document.createElement("div");
            dummyStudierenderElement.innerHTML = htmlStudierender;
            let liStudierenderElement = dummyStudierenderElement.firstElementChild;
            liStudierenderElement.remove();
            olStudierenderElement.appendChild(liStudierenderElement);

            //// TODO: Neue Methoden für Event Handler anlegen und hier registrieren ////
            liStudierenderElement.querySelector(".action.edit_studierender").addEventListener("click", () => location.hash = `#/editStudierender/${dataset_studierender._id}`);
            liStudierenderElement.querySelector(".action.delete_studierender").addEventListener("click", () => this._askDelete(dataset_studierender._id));
        }

            let data_kurse = await this._app.backend.fetch("GET", "/kurse");
            this._emptyMessageElementKurse = this._mainElement.querySelector(".empty-placeholder-kurse");

            if(data_kurse.length) {
                    this._emptyMessageElementKurse.classList.add("hidden");
                    }

        
            let olKurseElement = this._mainElement.querySelector(".olkurse");

            let templateKurseElement = this._mainElement.querySelector(".list-kurse-entry");
            let templateKurseHtml = templateKurseElement.outerHTML;
            templateKurseElement.remove();



            for(let index in data_kurse) {
                // Platzhalter ersetzen
                let entry_kurse = data_kurse[index];
                let htmlKurs = templateKurseHtml;

                // Daten speichern
                let _id = entry_kurse._id;
                let kursname = entry_kurse.name;
                let pruefungsform = entry_kurse.pruefungsform;
                let ects = entry_kurse.ects;


                // Daten ins html
                htmlKurs = htmlKurs.replace("$ID$", _id).replace("$TITEL$", kursname).replace("$PRUEFUNGSFORM$", pruefungsform).replace("$ECTS$", ects);


                // Kurs Liste einfügen
                let dummyKursElement = document.createElement("div");
                dummyKursElement.innerHTML = htmlKurs;
                let liKurseElement = dummyKursElement.firstElementChild;
                liKurseElement.remove();
                olKurseElement.appendChild(liKurseElement);

                liKurseElement.querySelector(".action.edit_kurs").addEventListener("click", () => location.hash = `#/editKurs/${entry_kurse._id}`);
                liKurseElement.querySelector(".action.delete_kurs").addEventListener("click", () => this._askDeleteKurs(entry_kurse._id));


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

    async _askDeleteStudierender(id) {
        // Sicherheitsfrage anzeigen
        let answer = confirm("Soll dieser Studierende wirklich gelöscht werden?");

        if(!answer) {
            return;
        }

        // Studierender löschen
        try {
            this._app.backend.fetch("DELETE", `/studierender/${id}`);
        } catch(ex) {
            this._app.showException(ex);
            return;
        }

        // Studierender aus Liste entfernen
        this._mainElement.querySelector(`[data-id="${id}"]`)?.remove();

        if(this._mainElement.querySelector("[data-id]")) {
            this._emptyMessageElement.classList.add("hidden");
        } else {
            this._emptyMessageElement.classList.remove("hidden");
        }
    }

    async _askDeleteKurs(id) {
            // Sicherheitsfrage anzeigen
            let answer = confirm("Soll dieser Kurs wirklich gelöscht werden?");

            if(!answer) {
                return;
            }

            // Kurs löschen
            try {
                this._app.backend.fetch("DELETE", `/kurs/${id}`);
            } catch(ex) {
                this._app.showException(ex);
                return;
            }

            // Kurs aus Liste entfernen
            this._mainElement.querySelector(`[data-id="${id}"]`)?.remove();

            if(this._mainElement.querySelector("[data-id]")) {
                this._emptyMessageElementKurse.classList.add("hidden");
            } else {
                this._emptyMessageElementKurse.classList.remove("hidden");
            }
        }
};
