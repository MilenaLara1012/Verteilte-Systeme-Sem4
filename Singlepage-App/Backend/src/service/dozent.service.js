"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Logik zur Verwaltung von Dozenten.
 * Implementeirung der Anwendungslogik zum Ausführen der CRUD-Methoden.
 */
export default class DozentService {

    /**
     * Konstruktor.
     */
    constructor() {
        this._dozenten = DatabaseFactory.database.collection("dozenten");
    }

    /**
     * Dozenten suchen.
     * @param {Object} query Optionale Suchparameter
     * @returns {Promise} Liste der gefundenen Dozenten
     */
    async search(query) {
        let cursor = this._dozenten.find(query, {
            sort: {
                vorname: 1,
                nachname: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Dozenten.
     * @param {Object} dozent zu speichernder Dozent
     * @returns {Promise} Gespeicherter Dozent
     */
    async create(dozent) {
        dozent = dozent || {};

        let newDozent = {
            vorname: dozent.vorname || "",
            nachname: dozent.nachname || "",
            fakultaet: dozent.fakultaet || "",
            email: dozent.email || "",
            status: dozent.status || "",
        };

        let result = await this._dozenten.insertOne(newDozent);
        return await this._dozenten.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines einzelnen Dozenten.
     * @param {String} id ID des gesuchten Dozenten
     * @returns {Promise} Gefundener Dozent
     */
    async read(id) {
        let result = await this._dozenten.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Dozenten
     * @param {String} id ID des gesuchten Dozenten
     * @param {[type]} dozent Zu speichernder Dozent
     * @returns {Promise} Gespeicherter Dozent
     */
    async update(id, dozent) {
        let oldDozent = await this._dozenten.findOne({_id: new ObjectId(id)});

        if(!oldDozent) {
            return;
        }

        let updateDoc = {
            $set: {},
        }

        if(dozent.vorname) {
            updateDoc.$set.vorname = dozent.vorname;
        }
        if(dozent.nachname) {
            updateDoc.$set.nachname = dozent.nachname;
        }
        if(dozent.fakultaet) {
            updateDoc.$set.fakultaet = dozent.fakultaet;
        }
        if(dozent.email) {
            updateDoc.$set.email = dozent.email;
        }
        if(dozent.status) {
            updateDoc.$set.status = dozent.status;
        }

        await this._dozenten.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._dozenten.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen eines einzelnen Dozenten
     * @param {String} id ID des gesuchten Dozenten
     * @returns {Promise} Anzahl der gelöschten Dozenten
     */
    async delete(id) {
        let result = await this._dozenten.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}