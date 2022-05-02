"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
*Implementier Logik für Kurse unabhängig vom Übertragungsweg
 */
export default class KursService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._kurse = DatabaseFactory.database.collection("kurse");
    }

    /**
     * Suche Kurse
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adressen
     */
    async search(query) {
        let cursor = this._kurse.find(query, {
            sort: {
                name: 1,
                prüfungsform: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern eines neuen Kurs.
     *
     * @param {Object} kurs Neuer Kurs
     * @return {Promise} Gespeicherter Kurs
     */
    async create(kurs) {
        kurs = kurs || {};

        let new_kurs = {
            name: kurs.first_name || "",
            prüfungsform:  kurs.last_name  || "",
            ects:      kurs.phone      || 0,
            
        };

        let result = await this._kurse.insertOne(new_kurs);
        return await this._kurse.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen eines Kurs mit ID.
     *
     * @param {String} id ID des Kurs
     * @return {Promise} Gefundener Kurs
     */
    async read(id) {
        let result = await this._kurse.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung eines Kurs
     *
     * @param {String} id ID des Kurs
     * @param {[type]} kurs Neue Kursdaten
     * @return {Promise} Gespeicherte Kursdaten
     */
    async update(id, kurs) {
        let old_kurs = await this._kurse.findOne({_id: new ObjectId(id)});
        if (!old_kurs) return;

        let updateDoc = {
            $set: {},
        }

        if (kurs.name) updateDoc.$set.name = kurs.name;
        if (kurs.prüfungsform)  updateDoc.$set.prüfungsform  = kurs.prüfungsform;
        if (kurs.ects)      updateDoc.$set.ects      = kurs.ects;
        

        await this._kurse.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._kurse.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen Kurs anhand von ID.
     *
     * @param {String} id ID des Kurses
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._kurse.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}