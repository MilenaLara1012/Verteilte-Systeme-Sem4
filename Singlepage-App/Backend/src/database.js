"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("univerwaltung");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        //// TODO: Methode anpassen, um zur eigenen App passende Demodaten anzulegen ////
        //// oder die Methode ggf. einfach löschen und ihren Aufruf oben entfernen.  ////
        let dozenten = this.database.collection("dozenten");

        if (await dozenten.estimatedDocumentCount() === 0) {
            dozenten.insertMany([
                {
                    vorname: "Christian",
                    nachname: "Heck",
                    fakultaet: "Wirtschaftsinformatik",
                    email: "christian@heckimweb.de",
                    intern: true,
                },
                {
                    vorname: "Max",
                    nachname: "Mustermann",
                    fakultaet: "BWL",
                    email: "max@mustermann.de",
                    intern: false,
                },
            ]);
        }

        // Hier müsstet ihre eure Collections entsprechend wie oben noch implementieren @MilenaLara1012 @Reschni96
    }
}

export default new DatabaseFactory();
