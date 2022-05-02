"use strict"

import DozentService from "../service/dozent.service.js";
import { wrapHandler } from "../utils.js";
import RestifyError from "restify-errors";

/**
 * Kurse-Controller
 */
export default class KursController {

    /**
     * Konstruktor. Hier werden alle URL-Handler registriert.
     * @param {Object} server Restify Serverinstanz
     * @param {String} prefix Prefix aller URLs der Klasse
     */
    constructor(server, prefix) {
        this._service = new KursService();
        this._prefix = prefix;

        // Collection: Kurse
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Entity: Kurs
        server.get(prefix + "/:id", wrapHandler(this, this.read));
        server.put(prefix + "/:id", wrapHandler(this, this.update));
        server.patch(prefix + "/:id", wrapHandler(this, this.update));
        server.del(prefix + "/:id", wrapHandler(this, this.delete));
    }

    /**
     * Fügt für den entsprechenden Datensatz alle HATEOAS-Links hinzu
     * @param {Object} entity Zu verändernder Dozenten-Datensatz
     */
    _insertHateoasLinks(entity) {
        let url = `${this._prefix}/${entity._id}`;

        entity._links = {
            read: {url: url, method: "GET"},
            update: {url: url, method: "PUT"},
            patch: {url: url, method: "PATCH"},
            delete: {url: url, method: "DELETE"},
        }
    }

    /**
     * GET /kurs
     * Alle Kurse auslesen
     */
    async search(req, res, next) {
        let result = await this._service.search(req.query);
        result.forEach(entity => this._insertHateoasLinks(entity));
        res.sendResult(result);

        return next();
    }

    /**
     * POST /kurs
     * Neuen Kurs anlegen
     */
    async create(req, res, next) {
        let result = await this._service.create(req.body);
        this._insertHateoasLinks(result);
        
        res.status(201);
        res.header("Location", `${this._prefix}/${result._id}`);
        res.sendResult(result);

        return next();
    }

    /**
     * GET /kurs/{id}
     * Einene Kurs mit id
     */
    async read(req, res, next) {
        let result = await this._service.read(req.params.id);
        this._insertHateoasLinks(result);

        if(result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Kein Kurs mit dieser ID");
        }
        
        return next();
    }

    /**
     * PATCH und PUT /kurs/{id}
     * Kursdaten aktualisieren
     */
    async update(req, res, next) {
        let result = await this._service.update(req.params.id, req.body);
        this._insertHateoasLinks(result);

        if(result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Kein Kurs mit dieser ID");
        }
        
        return next();
    }

    /**
     * DELETE /kurs/{id}
     * Kurs mit ID löschen
     */
    async delete(req, res, next) {
        await this._service.delete(req.params.id);
        res.status(204);
        res.sendResult({});
        return next();
    }
}