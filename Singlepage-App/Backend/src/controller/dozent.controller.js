"use strict"

import DozentService from "../service/dozent.service.js";
import { wrapHandler } from "../utils.js";
import RestifyError from "restify-errors";

/**
 * HTTP-Controller-Klasse für Dozenten. Diese Klasse registriert
 * alle notwendigen URL-Handler beim Webserver für einen einfachen REST-
 * Webservice zum Lesen und Schreiben von Adressen.
 */
export default class DozentController {

    /**
     * Konstruktor. Hier werden alle URL-Handler registriert.
     * @param {Object} server Restify Serverinstanz
     * @param {String} prefix Prefix aller URLs der Klasse
     */
    constructor(server, prefix) {
        this._service = new DozentService();
        this._prefix = prefix;

        // Collection: Dozenten
        server.get(prefix, wrapHandler(this, this.search));
        server.post(prefix, wrapHandler(this, this.create));

        // Entity: Dozent
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
     * GET /dozent
     * Alle Dozenten auslesen
     */
    async search(req, res, next) {
        let result = await this._service.search(req.query);
        result.forEach(entity => this._insertHateoasLinks(entity));
        res.sendResult(result);

        return next();
    }

    /**
     * POST /dozent
     * Neuen Dozenten anlegen
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
     * GET /dozent/{id}
     * Einzelnen Dozenten anhand ID auslesen
     */
    async read(req, res, next) {
        let result = await this._service.read(req.params.id);
        this._insertHateoasLinks(result);

        if(result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Dozent nicht gefunden");
        }
        
        return next();
    }

    /**
     * PATCH und PUT /dozent/{id}
     * Daten eines Dozenten anhand ID verändern
     */
    async update(req, res, next) {
        let result = await this._service.update(req.params.id, req.body);
        this._insertHateoasLinks(result);

        if(result) {
            res.sendResult(result);
        } else {
            throw new RestifyError.NotFoundError("Dozent nicht gefunden");
        }
        
        return next();
    }

    /**
     * DELETE /dozent/{id}
     * Einzelnen Dozenten anhand ID löschen 
     */
    async delete(req, res, next) {
        await this._service.delete(req.params.id);
        res.status(204);
        res.sendResult({});
        return next();
    }
}