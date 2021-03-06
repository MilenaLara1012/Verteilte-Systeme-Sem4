"use strict";

import Backend from "./backend.js";
import Router from "./router.js";
import "./app.css";

/**
 * Hauptklasse App: Steuert die gesamte Anwendung
 *
 * Diese Klasse erzeugt den Single Page Router zur Navigation innerhalb
 * der Anwendung und ein Datenbankobjekt zur Verwaltung der Adressliste.
 * Darüber hinaus beinhaltet sie verschiedene vom Single Page Router
 * aufgerufene Methoden, zum Umschalten der aktiven Seite.
 */
class App {
    /**
     * Konstruktor.
     */
    constructor() {
        // Datenbank-Klasse zur Verwaltung der Datensätze
        this.backend = new Backend();

        // Single Page Router zur Steuerung der sichtbaren Inhalte
        //// TODO: Routing-Regeln anpassen und ggf. neue Methoden anlegen ////
        this.router = new Router([
            {
                url: "^/$",
                show: () => this._gotoList()
            },
            //// TODO: Eigene Routing-Regeln hier in der Mitte einfügen ////
            // Routing-Regeln für Dozent
            {
                url: "^/newDozent/$",
                show: () => this._gotoNewDozent()
            },
            {
                url: "^/editDozent/(.*)$",
                show: matches => this._gotoEditDozent(matches[1]),
            },

            // Routing-Regeln für Studierender
            {
                url: "^/newStudierender/$",
                show: () => this._gotoNewStudierender()
            },
            {
                url: "^/editStudierender/(.*)$",
                show: matches => this._gotoEditStudierender(matches[1]),
            },

            {
                url: "^/newKurs/$",
                show: () => this._gotoNewKurs()
            },
            {
                url: "^/editKurs/(.*)$",
                show: matches => this._gotoEditKurs(matches[1]),
            },

            {
                url: ".*",
                show: () => this._gotoList()
            },
        ]);

        // Fenstertitel merken, um später den Name der aktuellen Seite anzuhängen
        this._documentTitle = document.title;

        // Von dieser Klasse benötigte HTML-Elemente
        this._pageCssElement = document.querySelector("#page-css");
        this._bodyElement = document.querySelector("body");
        this._menuElement = document.querySelector("#app-menu");
    }

    /**
     * Initialisierung der Anwendung beim Start. Im Gegensatz zum Konstruktor
     * der Klasse kann diese Methode mit der vereinfachten async/await-Syntax
     * auf die Fertigstellung von Hintergrundaktivitäten warten, ohne dabei
     * mit den zugrunde liegenden Promise-Objekten direkt hantieren zu müssen.
     */
    async init() {
        try {
            await this.backend.init();
            this.router.start();
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Übersichtsseite anzeigen. Wird vom Single Page Router aufgerufen.
     */
    async _gotoList() {
        try {
            // Dynamischer Import, vgl. https://javascript.info/modules-dynamic-imports
            let {default: PageList} = await import("./page-list/page-list.js");

            let page = new PageList(this);
            await page.init();
            this._showPage(page, "list");
        } catch (ex) {
            this.showException(ex);
        }
    }

    /**
     * Seite zum Anlegen eines Dozenten anzeigen
     */
    async _gotoNewDozent() {
        try {
            let {default: PageEditDozent} = await import("./page-dozent-edit/page-dozent-edit.js");

            let page = new PageEditDozent(this);
            await page.init();
            this._showPage(page, "newDozent");
        } catch(ex) {
            this.showException(ex);
        }
    }

    /**
     * Seite zum Bearbeiten eines DOzenten anzeigen
     * @param {Integer} id ID des zu bearbeitenden Datensatzes
     */
    async _gotoEditDozent(id) {
        try {
            let {default: PageEditDozent} = await import("./page-dozent-edit/page-dozent-edit.js");

            let page = new PageEditDozent(this, id);
            await page.init();
            this._showPage(page, "editDozent");
        } catch(ex) {
            this.showException(ex);
        }
    }

    // Studierende
    /**
     * Seite zum Anlegen eines Studierenden anzeigen
     */
    async _gotoNewStudierender() {
        try {
            let {default: PageStudierenderEdit} = await import("./page-studierender-edit/page-studierender-edit.js");

            let page = new PageStudierenderEdit(this);
            await page.init();
            this._showPage(page, "newStudierender");
        } catch (ex) {
            this.showException(ex);
        }
    }

    async _gotoEditStudierender(id) {
        try {
            let {default: PageStudierenderEdit} = await import("./page-studierender-edit/page-studierender-edit.js");

            let page = new PageStudierenderEdit(this, id);
            await page.init();
            this._showPage(page, "editStudierender");
        } catch (ex) {
            this.showException(ex);
        }
    }


    /**
     *Neuen Kurs anlegen
     */
     async _gotoNewKurs() {
        try {
            let {default: PageKursEdit} = await import("./page-kurs-edit/page-kurs-edit.js");

            let page = new PageKursEdit(this);
            await page.init();
            this._showPage(page, "newKurs");
        } catch(ex) {
            this.showException(ex);
        }
    }

    /**
     * kurs mit ID bearbeiten
       */
    async _gotoEditKurs(id) {
        try {
            let {default: PageKursEdit} = await import("./page-kurs-edit/page-kurs-edit.js");

            let page = new PageKursEdit(this, id);
            await page.init();
            this._showPage(page, "editKurs");
        } catch(ex) {
            this.showException(ex);
        }
    }


    /**
     * Interne Methode zum Umschalten der sichtbaren Seite.
     *
     * @param  {Page} page Objekt der anzuzeigenden Seiten
     * @param  {String} name Name zur Hervorhebung der Seite im Menü
     */
    _showPage(page, name) {
        // Fenstertitel aktualisieren
        document.title = `${this._documentTitle} – ${page.title}`;

        // Stylesheet der Seite einfügen
        this._pageCssElement.innerHTML = page.css;

        // Aktuelle Seite im Kopfbereich hervorheben
        this._menuElement.querySelectorAll("li").forEach(li => li.classList.remove("active"));
        this._menuElement.querySelectorAll(`li[data-page-name="${name}"]`).forEach(li => li.classList.add("active"));

        // Sichtbaren Hauptinhalt austauschen
        this._bodyElement.querySelector("main")?.remove();
        this._bodyElement.appendChild(page.mainElement);
    }

    /**
     * Hilfsmethode zur Anzeige eines Ausnahmefehlers. Der Fehler wird in der
     * Konsole protokolliert und als Popupmeldung angezeigt.
     *
     * @param {Object} ex Abgefangene Ausnahme
     */
    showException(ex) {
        console.error(ex);

        if (ex.message) {
            alert(ex.message)
        } else {
            alert(ex.toString());
        }
    }
}

/**
 * Anwendung starten
 */
window.addEventListener("load", async () => {
    let app = new App();
    await app.init();
});
