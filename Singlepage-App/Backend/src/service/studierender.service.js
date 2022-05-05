"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Logik zur Verwaltung der Studierenden
 * Implementierung der Anwendungslogik zum Ausführen der CRUDS-Methoden
 */
export default class StudierenderService {
    /**
     * Konstruktor
     */
    constructor() {
        this._studierender = DatabaseFactory.database.collection("studierender");
    }

    /**
     * Studierende suchen
     * @param {Object} query opt. Suchparameter
     * @returns {Promise} Liste aller gefundenen Studierenden
     */
    async search(query) {
        let cursor = this._studierender.find(query, {
            sort: {
                vorname: 1,
                nachname: 1,
            }
        });

        return cursor.toArray();

    }

    /**
     * einen neuen Studierenden abspeichern
     * @param {Object} studierender zu speichernder Studierender
     * @returns {Promise} abgespeicherter Studierender
     */
    async create(studierender) {
        studierender = studierender || {};

        let newStudierender = {
            vorname: studierender.vorname || "",
            nachname: studierender.nachname || "",
            alter: studierender.alter || "",
            matrikelnr: studierender.matrikelnr || "",
            email: studierender.email || "",
        };

        let result = await this._studierender.insertOne(newStudierender);
        return await this._studierender.findOne({
            _id: result.insertedId
        });
    }

    /**
     * einen einzelnen Studierenden auslesen
     * @param {String} id ID des gesuchten Studierenden
     * @returns {Promise} gefundener Studierender
     */
    async read(id) {
        let result = await this._studierender.findOne({
            _id: new ObjectId(id)
        });
        return result;
    }

    /**
     * einen einzelnen Studierenden aktualisieren
     * @param {String} id ID des gesuchten Studierenden
     * @param {[type]} studierender zu speichernder Studierende
     * @returns {Promise} abgespeicherter Studierender
     */
    async update(id, studierender) {
        let oldStudierender = await this._studierender.findOne({
            _id: new ObjectId(id)
        });

        if (!oldStudierender) {
            return;
        }

        let updateDoc = {
            $set: {},
        }

        if (studierender.vorname) {
            updateDoc.$set.vorname = studierender.vorname;
        }

        if (studierender.nachname) {
            updateDoc.$set.nachname = studierender.nachname;
        }

        if (studierender.alter) {
            updateDoc.$set.alter = studierender.alter;
        }

        if (studierender.matrikelnr) {
            updateDoc.$set.matrikelnr = studierender.matrikelnr;
        }

        if (studierender.email) {
            updateDoc.$set.email = studierender.email;
        }

        await this._studierender.updateOne({
            _id: new ObjectId(id)
        },
            updateDoc);
        return this._studierender.findOne({
            _id: new ObjectId(id)
        });
    }

    async delete(id) {
        let result = await this._studierender.deleteOne({
            _id: new ObjectId(id)
        });

        return result.deleteCount;
    }
}
